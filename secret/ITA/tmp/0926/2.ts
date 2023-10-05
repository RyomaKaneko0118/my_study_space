generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum CoordinatorRole {
  MAIN
  SUB
}

enum ContractType {
  HARD
  SOFT
}

model Customer {
  id               Int       @id @default(autoincrement()) @db.UnsignedInt
  boardClientId    Int       @unique @map("board_client_id") @db.UnsignedInt
  saCompanyId      Int?      @unique @map("sa_company_id") @db.UnsignedInt
  archived         Boolean   @default(false)
  dealingStartDate DateTime  @map("dealing_start_date") @db.Date
  dealingEndDate   DateTime? @map("dealing_end_date") @db.Date
  logoPath         String?   @unique @map("logo_path")
  sales            Int?      @db.UnsignedInt // NOTE: sort用で使用のため
  createdAt        DateTime  @default(now()) @map("created_at")
  updatedAt        DateTime  @updatedAt @map("updated_at")

  // has many
  customerDetails CustomerDetail[]
  customerPins    CustomerPin[]
  departments     Department[]
  managers        Manager[]
  contracts       Contract[]

  @@map("customers")
}

// NOTE: nameからaddress2まではboardAPIで取得する属性
model CustomerDetail {
  id            Int      @id @default(autoincrement()) @db.UnsignedInt
  customerId    Int      @map("customer_id") @db.UnsignedInt
  current       Boolean  @default(false)
  name          String
  nameDisp      String   @map("name_disp")
  sales         Int?
  zip           String?
  pref          String?
  address1      String?
  address2      String?
  financialYear Int      @map("financial_year")
  link          String   @default("")
  parent        String   @db.Text
  affiliate     String   @db.Text
  note          String   @db.Text
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // belongs to
  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)

  // has many
  coordinators Coordinator[]

  @@unique(fields: [customerId, financialYear])
  @@map("customer_details")
}

model CustomerPin {
  id         Int @id @default(autoincrement()) @db.UnsignedInt
  customerId Int @map("customer_id") @db.UnsignedInt
  saUserId   Int @map("sa_user_id") @db.UnsignedInt

  // belongs to
  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)

  @@unique(fields: [customerId, saUserId])
  @@map("customer_pins")
}

model Coordinator {
  id               Int             @id @default(autoincrement()) @db.UnsignedInt
  customerDetailId Int             @map("customer_detail_id") @db.UnsignedInt
  saUserId         Int             @map("sa_user_id") @db.UnsignedInt
  role             CoordinatorRole
  createdAt        DateTime        @default(now()) @map("created_at")
  updatedAt        DateTime        @updatedAt @map("updated_at")

  // belongs to
  customerDetail CustomerDetail @relation(fields: [customerDetailId], references: [id], onDelete: Cascade)

  @@unique(fields: [customerDetailId, saUserId])
  @@map("coordinators")
}

model Department {
  id               Int       @id @default(autoincrement()) @db.UnsignedInt
  customerId       Int       @map("customer_id") @db.UnsignedInt
  name             String
  dealingStartDate DateTime  @map("dealing_start_date") @db.Date
  dealingEndDate   DateTime? @map("dealing_end_date") @db.Date
  note             String    @db.Text
  postalCode       String    @default("") @map("postal_code")
  prefectureCode   Int?      @map("prefecture_code") @db.UnsignedTinyInt
  city             String    @default("")
  town             String    @default("")
  addressLine      String    @default("") @map("address_line")
  createdAt        DateTime  @default(now()) @map("created_at")
  updatedAt        DateTime  @updatedAt @map("updated_at")

  // belongs to
  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)

  // has many
  managers  Manager[]
  contracts Contract[]

  @@unique(fields: [customerId, name])
  @@map("departments")
}

model Manager {
  id            Int      @id @default(autoincrement()) @db.UnsignedInt
  customerId    Int      @map("customer_id") @db.UnsignedInt
  departmentId  Int?     @map("department_id") @db.UnsignedInt
  firstName     String   @map("first_name")
  lastName      String   @map("last_name")
  firstNameKana String   @map("first_name_kana")
  lastNameKana  String   @map("last_name_kana")
  email         String
  startYear     Int      @map("start_year") @db.Year
  endYear       Int?     @map("end_year") @db.Year
  post          String   @default("")
  role          String   @default("")
  phoneNumber   String   @default("") @map("phone_number")
  note          String   @db.Text
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // belongs to
  customer   Customer    @relation(fields: [customerId], references: [id], onDelete: Cascade)
  department Department? @relation(fields: [departmentId], references: [id], onDelete: SetNull)

  @@unique(fields: [customerId, email])
  @@map("managers")
}

model Contract {
  id                      Int          @id @default(autoincrement()) @db.UnsignedInt
  customerId              Int          @map("customer_id") @db.UnsignedInt
  departmentId            Int?         @map("department_id") @db.UnsignedInt
  contractId              Int?         @unique @map("contract_id") @db.UnsignedInt
  name                    String
  contractType            ContractType @map("contract_type")
  startDate               DateTime     @map("start_date") @db.Date
  endDate                 DateTime?    @map("end_date") @db.Date
  autoUpdateCountOfMonths Int?         @map("auto_update_count_of_months")
  filePath                String?      @unique @map("file_path")
  createdAt               DateTime     @default(now()) @map("created_at")
  updatedAt               DateTime     @updatedAt @map("updated_at")

  // belongs to
  customer       Customer    @relation(fields: [customerId], references: [id], onDelete: Cascade)
  department     Department? @relation(fields: [departmentId], references: [id], onDelete: SetNull)
  originContract Contract?   @relation("RelatedContract", fields: [contractId], references: [id], onDelete: SetNull)

  // has one
  updatedContract Contract? @relation("RelatedContract")

  @@map("contracts")
}
