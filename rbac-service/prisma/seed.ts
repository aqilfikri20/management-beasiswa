import bcrypt from "bcryptjs";
import { prisma } from "../src/config/prisma.js";

async function main() {
  console.log("🌱 Seeding RBAC database...");

  // ==========================================
  // ROLES
  // ==========================================

  const adminRole = await prisma.role.upsert({
    where: {
      code: "ADMIN",
    },
    update: {},
    create: {
      name: "Administrator",
      code: "ADMIN",
      description: "Mengelola seluruh sistem",
    },
  });

  const verifikatorRole = await prisma.role.upsert({
    where: {
      code: "VERIFIKATOR",
    },
    update: {},
    create: {
      name: "Verifikator",
      code: "VERIFIKATOR",
      description: "Melakukan verifikasi pendaftaran",
    },
  });

  const lembagaRole = await prisma.role.upsert({
    where: {
      code: "LEMBAGA_SELEKSI",
    },
    update: {},
    create: {
      name: "Lembaga Seleksi",
      code: "LEMBAGA_SELEKSI",
      description: "Melakukan proses seleksi peserta",
    },
  });
  const pendaftarRole = await prisma.role.upsert({
    where: {
      code: "PENDAFTAR",
    },
    update: {},
    create: {
      name: "Pendaftar",
      code: "PENDAFTAR",
      description: "Peserta yang mendaftar program beasiswa",
    },
  });

  console.log("✅ Roles created");

  // ==========================================
  // PERMISSIONS
  // ==========================================

  const permissionData = [
    {
      name: "Melihat Dashboard",
      code: "dashboard:read",
      description: "Melihat dashboard",
    },
    {
      name: "Melihat Pengguna",
      code: "user:read",
      description: "Melihat data pengguna",
    },
    {
      name: "Membuat Pengguna",
      code: "user:create",
      description: "Membuat pengguna",
    },
    {
      name: "Mengubah Pengguna",
      code: "user:update",
      description: "Mengubah pengguna",
    },
    {
      name: "Menghapus Pengguna",
      code: "user:delete",
      description: "Menghapus pengguna",
    },
    {
      name: "Melihat Program",
      code: "program:read",
      description: "Melihat data program",
    },
    {
      name: "Membuat Program",
      code: "program:create",
      description: "Membuat program",
    },
    {
      name: "Mengubah Program",
      code: "program:update",
      description: "Mengubah program",
    },
    {
      name: "Menghapus Program",
      code: "program:delete",
      description: "Menghapus program",
    },
    {
      name: "Verifikasi Pendaftaran",
      code: "registration:verify",
      description: "Memverifikasi pendaftaran peserta",
    },
    {
      name: "Melihat Hasil Seleksi",
      code: "selection:read",
      description: "Melihat hasil seleksi",
    },
    {
      name: "Mengubah Hasil Seleksi",
      code: "selection:update",
      description: "Mengubah hasil seleksi",
    },

    {
  name: "Membuat Seleksi Administrasi",
  code: "administrative_selection:create",
  description: "Membuat hasil seleksi administrasi",
},
{
  name: "Melihat Seleksi Administrasi",
  code: "administrative_selection:read",
  description: "Melihat hasil seleksi administrasi",
},
{
  name: "Mengubah Seleksi Administrasi",
  code: "administrative_selection:update",
  description: "Mengubah hasil seleksi administrasi",
},
{
  name: "Membuat Seleksi Wawancara",
  code: "interview_selection:create",
  description: "Membuat hasil seleksi wawancara",
},
{
  name: "Melihat Seleksi Wawancara",
  code: "interview_selection:read",
  description: "Melihat hasil seleksi wawancara",
},
{
  name: "Mengubah Seleksi Wawancara",
  code: "interview_selection:update",
  description: "Mengubah hasil seleksi wawancara",
},
{
  name: "Membuat Hasil Seleksi",
  code: "selection_result:create",
  description: "Membuat hasil akhir seleksi",
},
{
  name: "Melihat Hasil Seleksi",
  code: "selection_result:read",
  description: "Melihat hasil akhir seleksi",
},
{
  name: "Mengubah Hasil Seleksi",
  code: "selection_result:update",
  description: "Mengubah hasil akhir seleksi",
},

    {
    name: "Melihat Role",
    code: "role:read",
    description: "Melihat data role",
    },
    {
    name: "Membuat Role",
    code: "role:create",
    description: "Membuat role",
    },
    {
    name: "Mengubah Role",
    code: "role:update",
    description: "Mengubah role",
    },
    {
    name: "Menghapus Role",
    code: "role:delete",
    description: "Menghapus role",
    },
    {
  name: "Melihat Permission",
  code: "permission:read",
  description: "Melihat data permission",
},
{
  name: "Membuat Permission",
  code: "permission:create",
  description: "Membuat permission",
},
{
  name: "Mengubah Permission",
  code: "permission:update",
  description: "Mengubah permission",
},
{
  name: "Menghapus Permission",
  code: "permission:delete",
  description: "Menghapus permission",
},
{
  name: "Melihat Menu",
  code: "menu:read",
  description: "Melihat data menu",
},
{
  name: "Membuat Menu",
  code: "menu:create",
  description: "Membuat menu",
},
{
  name: "Mengubah Menu",
  code: "menu:update",
  description: "Mengubah menu",
},
{
  name: "Menghapus Menu",
  code: "menu:delete",
  description: "Menghapus menu",
},
{
  name: "Melihat Profil",
  code: "profile:read",
  description: "Melihat profil sendiri",
},
{
  name: "Mengubah Profil",
  code: "profile:update",
  description: "Mengubah profil sendiri",
},
{
  name: "Membuat Pendaftaran",
  code: "registration:create",
  description: "Membuat pendaftaran beasiswa",
},
{
  name: "Melihat Pendaftaran",
  code: "registration:read",
  description: "Melihat pendaftaran sendiri",
},
  ];

  const permissions = new Map<
    string,
    Awaited<ReturnType<typeof prisma.permission.create>>
  >();

  for (const data of permissionData) {
    const permission = await prisma.permission.upsert({
      where: {
        code: data.code,
      },
      update: {},
      create: data,
    });

    permissions.set(permission.code, permission);
  }

  console.log("✅ Permissions created");

  // ==========================================
  // MENUS
  // ==========================================

  const dashboardMenu = await prisma.menu.upsert({
    where: {
      code: "dashboard",
    },
    update: {},
    create: {
      name: "Dashboard",
      code: "dashboard",
      path: "/dashboard",
      icon: "bi-speedometer2",
      sortOrder: 1,
    },
  });

  const usersMenu = await prisma.menu.upsert({
    where: {
      code: "users",
    },
    update: {},
    create: {
      name: "Pengguna",
      code: "users",
      path: "/users",
      icon: "bi-people",
      sortOrder: 2,
    },
  });

  const programMenu = await prisma.menu.upsert({
    where: {
      code: "programs",
    },
    update: {},
    create: {
      name: "Program",
      code: "programs",
      path: "/internal",
      icon: "bi-folder",
      sortOrder: 3,
    },
  });

  const verificationMenu = await prisma.menu.upsert({
    where: {
      code: "verification",
    },
    update: {},
    create: {
      name: "Verifikasi",
      code: "verification",
      path: "/verification",
      icon: "bi-check-circle",
      sortOrder: 4,
    },
  });

  const selectionMenu = await prisma.menu.upsert({
    where: {
      code: "selection",
    },
    update: {},
    create: {
      name: "Seleksi",
      code: "selection",
      path: "/selection",
      icon: "bi-list-check",
      sortOrder: 5,
    },
  });

  console.log("✅ Menus created");

    const profileMenu = await prisma.menu.upsert({
    where: {
      code: "my-profile",
    },
    update: {},
    create: {
      name: "Profil Saya",
      code: "my-profile",
      path: "/dashboard/profile",
      icon: "bi-person",
      sortOrder: 2,
    },
  });

  const registrationsMenu = await prisma.menu.upsert({
    where: {
      code: "my-registrations",
    },
    update: {},
    create: {
      name: "Pendaftaran Saya",
      code: "my-registrations",
      path: "/dashboard/registrations",
      icon: "bi-file-earmark-text",
      sortOrder: 4,
    },
  });

  // ==========================================
  // ROLE → PERMISSION
  // ==========================================

  const assignPermissions = async (
    roleId: number,
    permissionCodes: string[],
  ) => {
    for (const code of permissionCodes) {
      const permission = permissions.get(code);

      if (!permission) {
        throw new Error(`Permission ${code} tidak ditemukan`);
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId,
          permissionId: permission.id,
        },
      });
    }
  };

  // ADMIN → semua permission
  await assignPermissions(
    adminRole.id,
    permissionData.map((permission) => permission.code),
  );

  // VERIFIKATOR
  await assignPermissions(verifikatorRole.id, [
    "dashboard:read",
    "program:read",
    "registration:verify",
  ]);

  // LEMBAGA SELEKSI
 // LEMBAGA SELEKSI
await assignPermissions(lembagaRole.id, [
  "dashboard:read",
  "program:read",

  "administrative_selection:create",
  "administrative_selection:read",
  "administrative_selection:update",

  "interview_selection:create",
  "interview_selection:read",
  "interview_selection:update",

  "selection_result:create",
  "selection_result:read",
  "selection_result:update",
]);

  console.log("✅ Role permissions assigned");

await assignPermissions(pendaftarRole.id, [
    "dashboard:read",
    "program:read",
    "profile:read",
    "profile:update",
    "registration:create",
    "registration:read",
  ]);
  // ==========================================
  // ROLE → MENU
  // ==========================================

  const assignMenus = async (roleId: number, menuIds: number[]) => {
    for (const menuId of menuIds) {
      await prisma.roleMenu.upsert({
        where: {
          roleId_menuId: {
            roleId,
            menuId,
          },
        },
        update: {},
        create: {
          roleId,
          menuId,
        },
      });
    }
  };

  await assignMenus(adminRole.id, [
    dashboardMenu.id,
    usersMenu.id,
    programMenu.id,
    verificationMenu.id,
    selectionMenu.id,
  ]);

  await assignMenus(verifikatorRole.id, [
    dashboardMenu.id,
    programMenu.id,
    verificationMenu.id,
  ]);

  await assignMenus(lembagaRole.id, [
    dashboardMenu.id,
    programMenu.id,
    selectionMenu.id,
  ]);

  await assignMenus(pendaftarRole.id, [
    dashboardMenu.id,
    profileMenu.id,
    programMenu.id,
    registrationsMenu.id,
  ]);  
  console.log("✅ Role menus assigned");

  // ==========================================
  // ADMIN USER
  // ==========================================

  const passwordHash = await bcrypt.hash("Admin123!", 12);

  await prisma.user.upsert({
    where: {
      email: "admin@rbac.local",
    },
    update: {
      roleId: adminRole.id,
      passwordHash,
    },
    create: {
      roleId: adminRole.id,
      username: "admin",
      email: "admin@rbac.local",
      passwordHash,
      fullName: "Administrator",
    },
  });

const verifikatorPasswordHash = await bcrypt.hash(
  "Verifikator123!",
  12,
);

await prisma.user.upsert({
  where: {
    email: "verifikator@rbac.local",
  },
  update: {
    roleId: verifikatorRole.id,
    passwordHash: verifikatorPasswordHash,
  },
  create: {
    roleId: verifikatorRole.id,
    username: "verifikator",
    email: "verifikator@rbac.local",
    passwordHash: verifikatorPasswordHash,
    fullName: "User Verifikator",
  },
});

const lembagaPasswordHash = await bcrypt.hash(
  "Lembaga123!",
  12,
);

await prisma.user.upsert({
  where: {
    email: "lembaga@rbac.local",
  },
  update: {
    roleId: lembagaRole.id,
    passwordHash: lembagaPasswordHash,
  },
  create: {
    roleId: lembagaRole.id,
    username: "lembaga",
    email: "lembaga@rbac.local",
    passwordHash: lembagaPasswordHash,
    fullName: "User Lembaga Seleksi",
  },
});

  console.log("✅ Admin user created");

  console.log("🌱 Seed completed successfully");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });