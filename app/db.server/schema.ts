import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import {
  BaseSQLiteDatabase,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    avatar: text("avatar"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .defaultNow(),
    ghAccessToken: text("gh_access_token").notNull(),
    ghUsername: text("gh_username").notNull(),
  },
  (users) => {
    return {
      emailIndex: uniqueIndex("email_idx").on(users.email),
      ghAccessTokenIndex: index("gh_access_token_idx").on(users.ghAccessToken),
    }
  },
)
export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>
// A safe variant of the user that can be serialized to the client
export type SafeUser = Omit<User, "ghAccessToken">

const schema = {
  users,
}

export default schema

export type DB = BaseSQLiteDatabase<"async" | "sync", unknown, typeof schema>
