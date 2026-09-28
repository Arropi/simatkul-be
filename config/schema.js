import {
  pgTable,
  text,
  varchar,
  pgEnum,
  bigint,
  integer,
  smallint,
  date,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "user"]);

// Tabel User (Auth)
export const users = pgTable("user", {
  username: varchar("username", { length: 255 }).primaryKey(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("admin"),
});

// Tabel Dosen
export const dosen = pgTable("dosen", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  nama: text("nama").notNull(),
  nidn: varchar("nidn", { length: 255 }).notNull(),
  jabatan_akademik: varchar("jabatan_akademik", { length: 255 }).notNull(),
}, (table) => [
  index("idx_dosen_nidn").on(table.nidn),
]);

// Tabel Kelas
export const kelas = pgTable("kelas", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  prodi: varchar("prodi", { length: 255 }).notNull(),
  semester: integer("semester").notNull(),
  kelas: varchar("kelas", { length: 255 }).notNull(),
  kode_kelas: varchar("kode_kelas", { length: 255 }).notNull(),
}, (table) => [
  index("idx_kelas_kode_kelas").on(table.kode_kelas),
  index("idx_kelas_prodi_semester").on(table.prodi, table.semester),
]);

// Tabel Kurikulum
export const kurikulum = pgTable("kurikulum", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  semester: varchar("semester", { length: 255 }).notNull(),
  tahun: date("tahun").notNull(),
  description: text("description"),
});

// Tabel Mata Kuliah
export const mataKuliah = pgTable("mata_kuliah", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  kode: varchar("kode", { length: 255 }).notNull(),
  nama: varchar("nama", { length: 255 }).notNull(),
  sks: smallint("sks").notNull(),
  prodi: varchar("prodi", { length: 255 }).notNull(),
  jenis: varchar("jenis", { length: 255 }).notNull(),
  kelompok: varchar("kelompok", { length: 255 }).notNull(),
  tipe_kelas: varchar("tipe_kelas", { length: 255 }).notNull(),
  semester: integer("semester").notNull(),
}, (table) => [
  index("idx_mata_kuliah_kode").on(table.kode),
  index("idx_mata_kuliah_prodi").on(table.prodi),
]);

// Tabel Ruang
export const ruang = pgTable("ruang", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  nama: varchar("nama", { length: 255 }).notNull(),
});

// Tabel Sesi
export const sesi = pgTable("sesi", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  jam_mulai: timestamp("jam_mulai", { mode: "string" }).notNull(),
  jam_akhir: timestamp("jam_akhir", { mode: "string" }).notNull(),
}, (table) => [
  index("idx_sesi_jam_mulai").on(table.jam_mulai),
]);

// Tabel Relasi Kurikulum - Mata Kuliah
export const kurikulumMataKuliah = pgTable("kurikulum_mata_kuliah", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  kurikulum_id: bigint("kurikulum_id", { mode: "number" })
    .notNull()
    .references(() => kurikulum.id, { onDelete: "cascade" }),
  mata_kuliah_id: bigint("mata_kuliah_id", { mode: "number" })
    .notNull()
    .references(() => mataKuliah.id, { onDelete: "cascade" }),
}, (table) => [
  index("idx_kurikulum_matkul_kurikulum_id").on(table.kurikulum_id),
  index("idx_kurikulum_matkul_matkul_id").on(table.mata_kuliah_id),
]);

// Tabel Relasi Kurikulum - Sesi
export const kurikulumSesi = pgTable("kurikulum_sesi", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  kurikulum_id: bigint("kurikulum_id", { mode: "number" })
    .notNull()
    .references(() => kurikulum.id, { onDelete: "cascade" }),
  sesi_id: bigint("sesi_id", { mode: "number" })
    .notNull()
    .references(() => sesi.id, { onDelete: "cascade" }),
}, (table) => [
  index("idx_kurikulum_sesi_kurikulum_id").on(table.kurikulum_id),
  index("idx_kurikulum_sesi_sesi_id").on(table.sesi_id),
]);

// Tabel Relasi Kurikulum - Dosen
export const kurikulumDosen = pgTable("kurikulum_dosen", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  kurikulum_id: bigint("kurikulum_id", { mode: "number" })
    .notNull()
    .references(() => kurikulum.id, { onDelete: "cascade" }),
  dosen_id: bigint("dosen_id", { mode: "number" })
    .notNull()
    .references(() => dosen.id, { onDelete: "cascade" }),
}, (table) => [
  index("idx_kurikulum_dosen_kurikulum_id").on(table.kurikulum_id),
  index("idx_kurikulum_dosen_dosen_id").on(table.dosen_id),
]);

// Tabel Relasi Kurikulum - Kelas
export const kurikulumKelas = pgTable("kurikulum_kelas", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  kurikulum_id: bigint("kurikulum_id", { mode: "number" })
    .notNull()
    .references(() => kurikulum.id, { onDelete: "cascade" }),
  kelas_id: bigint("kelas_id", { mode: "number" })
    .notNull()
    .references(() => kelas.id, { onDelete: "cascade" }),
}, (table) => [
  index("idx_kurikulum_kelas_kurikulum_id").on(table.kurikulum_id),
  index("idx_kurikulum_kelas_kelas_id").on(table.kelas_id),
]);

// Tabel Relasi Kurikulum - Ruang
export const kurikulumRuang = pgTable("kurikulum_ruang", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  kurikulum_id: bigint("kurikulum_id", { mode: "number" })
    .notNull()
    .references(() => kurikulum.id, { onDelete: "cascade" }),
  ruang_id: bigint("ruang_id", { mode: "number" })
    .notNull()
    .references(() => ruang.id, { onDelete: "cascade" }),
}, (table) => [
  index("idx_kurikulum_ruang_kurikulum_id").on(table.kurikulum_id),
  index("idx_kurikulum_ruang_ruang_id").on(table.ruang_id),
]);

// Tabel Penjadwalan
export const penjadwalan = pgTable("penjadwalan", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  kurikulum_id: bigint("kurikulum_id", { mode: "number" })
    .notNull()
    .references(() => kurikulum.id, { onDelete: "cascade" }),
  matkul_id: bigint("matkul_id", { mode: "number" })
    .notNull()
    .references(() => mataKuliah.id, { onDelete: "cascade" }),
  ruang_id: bigint("ruang_id", { mode: "number" })
    .notNull()
    .references(() => ruang.id, { onDelete: "cascade" }),
  kelas_id: bigint("kelas_id", { mode: "number" })
    .notNull()
    .references(() => kelas.id, { onDelete: "cascade" }),
  hari: varchar("hari", { length: 255 }).notNull(),
}, (table) => [
  index("idx_penjadwalan_kurikulum_id").on(table.kurikulum_id),
  index("idx_penjadwalan_kurikulum_hari").on(table.kurikulum_id, table.hari),
  index("idx_penjadwalan_ruang_id").on(table.ruang_id),
  index("idx_penjadwalan_kelas_id").on(table.kelas_id),
  index("idx_penjadwalan_matkul_id").on(table.matkul_id),
]);

// Tabel Relasi Penjadwalan - Sesi
export const penjadwalanSesi = pgTable("penjadwalan_sesi", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  penjadwalan_id: bigint("penjadwalan_id", { mode: "number" })
    .notNull()
    .references(() => penjadwalan.id, { onDelete: "cascade" }),
  sesi_id: bigint("sesi_id", { mode: "number" })
    .notNull()
    .references(() => sesi.id, { onDelete: "cascade" }),
}, (table) => [
  index("idx_penjadwalan_sesi_penjadwalan_id").on(table.penjadwalan_id),
  index("idx_penjadwalan_sesi_sesi_id").on(table.sesi_id),
  uniqueIndex("idx_penjadwalan_sesi_unique").on(table.penjadwalan_id, table.sesi_id),
]);

// Tabel Relasi Penjadwalan - Dosen
export const penjadwalanDosen = pgTable("penjadwalan_dosen", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  penjadwalan_id: bigint("penjadwalan_id", { mode: "number" })
    .notNull()
    .references(() => penjadwalan.id, { onDelete: "cascade" }),
  dosen_id: bigint("dosen_id", { mode: "number" })
    .notNull()
    .references(() => dosen.id, { onDelete: "cascade" }),
}, (table) => [
  index("idx_penjadwalan_dosen_penjadwalan_id").on(table.penjadwalan_id),
  index("idx_penjadwalan_dosen_dosen_id").on(table.dosen_id),
  uniqueIndex("idx_penjadwalan_dosen_unique").on(table.penjadwalan_id, table.dosen_id),
]);


