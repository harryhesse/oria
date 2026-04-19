generator client {
provider = "prisma-client"
output = "../app/generated/prisma"
}

datasource db {
provider = "postgresql"
}

model User {
id String @id @default(cuid())
clerkId String @unique
email String?
name String?

bookings Booking[]

createdAt DateTime @default(now())
}

model Event {
id String @id @default(cuid())
title String
description String?
location String?
date DateTime

capacity Int?
isActive Boolean @default(true)

// Optional base price (fallback / default)
basePrice Int?

// Relations
pricing EventPrice[]
bookings Booking[]

createdAt DateTime @default(now())
}

model EventPrice {
id String @id @default(cuid())

eventId String
shootType ShootType

price Int

event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)

@@unique([eventId, shootType])
}

model Booking {
id String @id @default(cuid())

userId String
eventId String

shootType ShootType

status BookingStatus @default(PENDING)
paymentStatus PaymentStatus @default(PENDING)

stripeSessionId String? @unique
stripePaymentIntentId String? @unique

// Flexible extra data (participants, notes, etc.)
participantData Json?

user User @relation(fields: [userId], references: [id])
event Event @relation(fields: [eventId], references: [id])

gallery Gallery?

createdAt DateTime @default(now())

@@unique([userId, eventId])
}

model Gallery {
id String @id @default(cuid())

bookingId String @unique

downloadUrl String?
isReady Boolean @default(false)

downloaded Boolean @default(false)
downloadedAt DateTime?

rating Int?
review String?

booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

enum ShootType {
INDIVIDUAL
COUPLE
GROUP
EVENT
}

enum BookingStatus {
PENDING
CONFIRMED
CANCELLED
}

enum PaymentStatus {
PENDING
PAID
FAILED
}
