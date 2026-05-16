import {
  AchievementStatus,
  GoalStatus,
  Quarter,
  Role,
  TriggerType,
  UomType,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { calculateAchievementScore } from "../lib/scoring";

const DEMO_PASSWORD = "Demo@1234";

type SeedGoal = {
  thrustArea: string;
  title: string;
  uomType: UomType;
  target: number;
  weightage: number;
  deadline?: Date;
  actual: number;
  completionDate?: Date;
};

const rahulGoals: SeedGoal[] = [
  {
    thrustArea: "Revenue",
    title: "Quarterly sales revenue",
    uomType: UomType.MIN,
    target: 5_000_000,
    weightage: 30,
    actual: 5_500_000,
  },
  {
    thrustArea: "Customer",
    title: "Reduce customer TAT",
    uomType: UomType.MAX,
    target: 48,
    weightage: 25,
    actual: 40,
  },
  {
    thrustArea: "Safety",
    title: "Zero safety incidents",
    uomType: UomType.ZERO,
    target: 0,
    weightage: 20,
    actual: 0,
  },
  {
    thrustArea: "Product",
    title: "Product launch deadline",
    uomType: UomType.TIMELINE,
    target: 0,
    deadline: new Date("2025-06-30"),
    weightage: 15,
    actual: 0,
    completionDate: new Date("2025-06-15"),
  },
  {
    thrustArea: "People",
    title: "Team NPS score",
    uomType: UomType.MIN,
    target: 75,
    weightage: 10,
    actual: 82,
  },
];

async function resetDatabase() {
  await prisma.escalationEvent.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.checkinComment.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.escalationRule.deleteMany();
  await prisma.cycle.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await resetDatabase();

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@demo.com",
      passwordHash,
      role: Role.ADMIN,
      department: "HR",
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Sneha Patil",
      email: "manager@demo.com",
      passwordHash,
      role: Role.MANAGER,
      department: "Engineering",
      managerId: admin.id,
    },
  });

  const [rahul, priya, arjun] = await Promise.all(
    [
      { name: "Rahul Shah", email: "employee1@demo.com" },
      { name: "Priya Mehta", email: "employee2@demo.com" },
      { name: "Arjun Kumar", email: "employee3@demo.com" },
    ].map((employee) =>
      prisma.user.create({
        data: {
          ...employee,
          passwordHash,
          role: Role.EMPLOYEE,
          department: "Engineering",
          managerId: manager.id,
        },
      })
    )
  );

  await prisma.cycle.create({
    data: {
      name: "Q1 2025",
      quarter: Quarter.Q1,
      opensAt: new Date("2025-05-01"),
      closesAt: new Date("2025-07-31"),
      isActive: true,
    },
  });

  for (const goalData of rahulGoals) {
    const goal = await prisma.goal.create({
      data: {
        employeeId: rahul.id,
        thrustArea: goalData.thrustArea,
        title: goalData.title,
        uomType: goalData.uomType,
        target: goalData.target,
        deadline: goalData.deadline,
        weightage: goalData.weightage,
        status: GoalStatus.APPROVED,
        locked: true,
      },
    });

    const score = calculateAchievementScore(
      goalData.uomType,
      goalData.target,
      goalData.actual,
      {
        deadline: goalData.deadline,
        completionDate: goalData.completionDate,
      }
    );

    const status =
      score !== null && score >= 80
        ? AchievementStatus.COMPLETED
        : score !== null && score >= 50
          ? AchievementStatus.ON_TRACK
          : AchievementStatus.NOT_STARTED;

    await prisma.achievement.create({
      data: {
        goalId: goal.id,
        employeeId: rahul.id,
        quarter: Quarter.Q1,
        actual: goalData.actual,
        completionDate: goalData.completionDate,
        status,
        score,
      },
    });
  }

  await prisma.escalationRule.createMany({
    data: [
      {
        name: "Goal not submitted",
        triggerType: TriggerType.NO_SUBMISSION,
        thresholdDays: 5,
      },
      {
        name: "Goal not approved",
        triggerType: TriggerType.NO_APPROVAL,
        thresholdDays: 3,
      },
      {
        name: "Check-in missing",
        triggerType: TriggerType.NO_CHECKIN,
        thresholdDays: 7,
      },
    ],
  });

  console.log("Seed complete:");
  console.log(`  Users: admin, manager, ${rahul.name}, ${priya.name}, ${arjun.name}`);
  console.log(`  Goals for ${rahul.name}: ${rahulGoals.length} (APPROVED, locked)`);
  console.log(`  Active cycle: Q1 2025`);
  console.log(`  Escalation rules: 3`);
  console.log(`  Demo password for all accounts: ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
