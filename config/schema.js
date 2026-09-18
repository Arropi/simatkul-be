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
});

// Tabel Kelas
export const kelas = pgTable("kelas", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  prodi: varchar("prodi", { length: 255 }).notNull(),
  semester: integer("semester").notNull(),
  kelas: varchar("kelas", { length: 255 }).notNull(),
  kode_kelas: varchar("kode_kelas", { length: 255 }).notNull(),
});

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
  kode: bigint("kode", { mode: "number" }).notNull(),
  nama: varchar("nama", { length: 255 }).notNull(),
  sks: smallint("sks").notNull(),
  prodi: varchar("prodi", { length: 255 }).notNull(),
  jenis: varchar("jenis", { length: 255 }).notNull(),
  kelompok: varchar("kelompok", { length: 255 }).notNull(),
  tipe_kelas: varchar("tipe_kelas", { length: 255 }).notNull(),
  semester: integer("semester").notNull(),
});

// Tabel Ruang
export const ruang = pgTable("ruang", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  nama: varchar("nama", { length: 255 }).notNull(),
});

// Tabel Sesi
export const sesi = pgTable("sesi", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  nama: bigint("nama", { mode: "number" }).notNull(),
  jam_mulai: timestamp("jam_mulai", { mode: "string" }).notNull(),
  jam_akhir: timestamp("jam_akhir", { mode: "string" }).notNull(),
});

// Tabel Relasi Kurikulum - Mata Kuliah
export const kurikulumMataKuliah = pgTable("kurikulum_mata_kuliah", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  kurikulum_id: bigint("kurikulum_id", { mode: "number" }).notNull(),
  mata_kuliah_id: bigint("mata_kuliah_id", { mode: "number" }).notNull(),
});

// Tabel Relasi Kurikulum - Sesi
export const kurikulumSesi = pgTable("kurikulum_sesi", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  kurikulum_id: bigint("kurikulum_id", { mode: "number" }).notNull(),
  sesi_id: bigint("sesi_id", { mode: "number" }).notNull(),
});

// Tabel Relasi Kurikulum - Dosen
export const kurikulumDosen = pgTable("kurikulum_dosen", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  kurikulum_id: bigint("kurikulum_id", { mode: "number" }).notNull(),
  dosen_id: bigint("dosen_id", { mode: "number" }).notNull(),
});

// Tabel Relasi Kurikulum - Kelas
export const kurikulumKelas = pgTable("kurikulum_kelas", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  kurikulum_id: bigint("kurikulum_id", { mode: "number" }).notNull(),
  kelas_id: bigint("kelas_id", { mode: "number" }).notNull(),
});

// Tabel Relasi Kurikulum - Ruang
export const kurikulumRuang = pgTable("kurikulum_ruang", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
  kurikulum_id: bigint("kurikulum_id", { mode: "number" }).notNull(),
  ruang_id: bigint("ruang_id", { mode: "number" }).notNull(),
});

