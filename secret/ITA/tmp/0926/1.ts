enum ContractType {
  PAPER
  ELECTRON
}
model Contract {
  id               Int          @id @default(autoincrement()) @db.UnsignedInt
  customerId       Int          @map("customer_id") @db.UnsignedInt
  departmentId     Int?         @map("department_id") @db.UnsignedInt
  name             String
  contractType     ContractType @map("contract_type")
  dealingStartDate DateTime     @map("dealing_start_date") @db.Date
  dealingEndDate   DateTime     @map("dealing_end_date") @db.Date
  autoUpdated      Boolean      @default(false) @map("auto_updated")
  updatePeriodDays Int?         @map("update_period_days")
  filePath         String?      @unique @map("file_path")

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // belongs to
  customer   Customer    @relation(fields: [customerId], references: [id], onDelete: Cascade)
  department Department? @relation(fields: [departmentId], references: [id])

  @@unique(fields: [customerId, name])
  @@map("contracts")