import {
    sqliteTable,
    text,
    integer,
  } from "drizzle-orm/sqlite-core"

  export const fastFoodLog = sqliteTable("fastFoodLog", {
    id: integer("id").primaryKey(),
    fastFoodName: text("fastFoodName").notNull(),
    dateEaten: text("dateEaten").notNull(),
  })