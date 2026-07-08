import { pgTable, text, timestamp, boolean, integer, numeric, jsonb, serial } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
// export const todos = pgTable("todos", {
//   id: serial("id").primaryKey(),
//   userId: text("userId").notNull(),
//   title: text("title").notNull(),
//   completed: boolean("completed").notNull().default(false),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
// })
//
// If the user asks for foreign keys, add the reference back in:
//   userId: text("userId")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),

// --- HobbyFi Copilot tables ------------------------------------------------

export const vendors = pgTable('vendors', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(), // Owner of the vendor account
  name: text('name').notNull(),
  email: text('email').notNull(),
  city: text('city').notNull(),
  hobby: text('hobby').notNull(), // e.g., 'Badminton', 'Cricket', 'Yoga'
  totalMembers: integer('totalMembers').notNull().default(0),
  activeMembers: integer('activeMembers').notNull().default(0),
  monthlyRevenue: numeric('monthlyRevenue', { precision: 10, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const vendorUsers = pgTable('vendor_users', {
  id: serial('id').primaryKey(),
  vendorId: text('vendorId').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  status: text('status').notNull(), // 'trial', 'active', 'inactive'
  trialExpiresAt: timestamp('trialExpiresAt'),
  membershipExpiresAt: timestamp('membershipExpiresAt'),
  joinedAt: timestamp('joinedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  vendorId: text('vendorId').notNull(),
  userId: integer('userId').notNull(),
  courtName: text('courtName').notNull(),
  startTime: timestamp('startTime').notNull(),
  endTime: timestamp('endTime').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull(), // 'confirmed', 'completed', 'cancelled'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const approvalRequests = pgTable('approval_requests', {
  id: text('id').primaryKey(),
  vendorId: text('vendorId').notNull(),
  type: text('type').notNull(), // 'extend_membership', 'trial_extension', 'user_update'
  description: text('description').notNull(),
  targetUserId: integer('targetUserId'),
  proposedChanges: jsonb('proposedChanges'),
  status: text('status').notNull(), // 'pending', 'approved', 'rejected'
  approvedBy: text('approvedBy'),
  approvedAt: timestamp('approvedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  vendorId: text('vendorId').notNull(),
  action: text('action').notNull(), // 'query', 'update', 'delete', 'approval'
  query: text('query'),
  result: jsonb('result'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
