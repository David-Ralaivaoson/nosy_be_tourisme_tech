-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "AccommodationCategory" AS ENUM ('HOTEL', 'BUNGALOW', 'VILLA', 'ECOLODGE', 'LUXE', 'GUEST_HOUSE');

-- CreateEnum
CREATE TYPE "AccommodationZone" AS ENUM ('NORTH', 'SOUTH', 'WEST', 'EAST', 'CENTER');

-- CreateEnum
CREATE TYPE "TransportType" AS ENUM ('TRANSFER', 'VEHICLE_RENTAL');

-- CreateEnum
CREATE TYPE "TransportUnit" AS ENUM ('TRIP', 'DAY');

-- CreateEnum
CREATE TYPE "TransportBookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'EMAIL_SENT', 'CONTACTED', 'CONFIRMED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "QuoteItemType" AS ENUM ('ACCOMMODATION', 'EXCURSION', 'TRANSPORT');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "RealEstateInquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TerrainStatut" AS ENUM ('TITRE_BORNE', 'BORNE', 'EN_COURS');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodations" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "AccommodationCategory" NOT NULL,
    "zone" "AccommodationZone" NOT NULL,
    "descriptionFr" TEXT,
    "descriptionEn" TEXT,
    "pricePerNightLowSeason" INTEGER NOT NULL,
    "pricePerNightHighSeason" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 2,
    "stars" INTEGER NOT NULL DEFAULT 3,
    "rating" DOUBLE PRECISION,
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_images" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altFr" TEXT,
    "altEn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "season_rates" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "label" TEXT,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "pricePerNight" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "season_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "excursions" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "descriptionFr" TEXT,
    "descriptionEn" TEXT,
    "pricePerPerson" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "includesLunch" BOOLEAN NOT NULL DEFAULT false,
    "includesTransfer" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "excursions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "excursion_images" (
    "id" TEXT NOT NULL,
    "excursionId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altFr" TEXT,
    "altEn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "excursion_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_options" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TransportType" NOT NULL,
    "price" INTEGER NOT NULL,
    "unit" "TransportUnit" NOT NULL,
    "withDriver" BOOLEAN NOT NULL DEFAULT false,
    "capacity" INTEGER,
    "descriptionFr" TEXT,
    "descriptionEn" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transport_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_availabilities" (
    "id" TEXT NOT NULL,
    "transportOptionId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transport_availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_bookings" (
    "id" TEXT NOT NULL,
    "transportOptionId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "status" "TransportBookingStatus" NOT NULL DEFAULT 'PENDING',
    "quoteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transport_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terrains" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "surface" INTEGER NOT NULL,
    "statut" "TerrainStatut" NOT NULL,
    "price" INTEGER NOT NULL,
    "vueMer" BOOLEAN NOT NULL DEFAULT false,
    "eau" BOOLEAN NOT NULL DEFAULT false,
    "electricite" BOOLEAN NOT NULL DEFAULT false,
    "exclusivite" BOOLEAN NOT NULL DEFAULT false,
    "descriptionFr" TEXT,
    "descriptionEn" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terrains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terrain_images" (
    "id" TEXT NOT NULL,
    "terrainId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altFr" TEXT,
    "altEn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terrain_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terrain_documents" (
    "id" TEXT NOT NULL,
    "terrainId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terrain_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "real_estate_inquiries" (
    "id" TEXT NOT NULL,
    "terrainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "message" TEXT,
    "status" "RealEstateInquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "real_estate_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "quoteNumber" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "arrivalDate" DATE,
    "departureDate" DATE,
    "guests" INTEGER NOT NULL DEFAULT 2,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientWhatsapp" TEXT NOT NULL,
    "notes" TEXT,
    "total" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'MGA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_items" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "itemType" "QuoteItemType" NOT NULL,
    "referenceId" TEXT,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "unitPrice" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "numberOfNights" INTEGER,
    "numberOfPeople" INTEGER,
    "total" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accommodationId" TEXT,
    "excursionId" TEXT,
    "transportId" TEXT,

    CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT NOT NULL DEFAULT 'resend',
    "providerId" TEXT,
    "errorMessage" TEXT,
    "payload" JSONB,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "tripType" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accommodations_slug_key" ON "accommodations"("slug");

-- CreateIndex
CREATE INDEX "accommodations_zone_idx" ON "accommodations"("zone");

-- CreateIndex
CREATE INDEX "accommodations_category_idx" ON "accommodations"("category");

-- CreateIndex
CREATE INDEX "accommodations_isActive_idx" ON "accommodations"("isActive");

-- CreateIndex
CREATE INDEX "accommodation_images_accommodationId_idx" ON "accommodation_images"("accommodationId");

-- CreateIndex
CREATE INDEX "season_rates_accommodationId_startDate_endDate_idx" ON "season_rates"("accommodationId", "startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "excursions_slug_key" ON "excursions"("slug");

-- CreateIndex
CREATE INDEX "excursions_isActive_idx" ON "excursions"("isActive");

-- CreateIndex
CREATE INDEX "excursion_images_excursionId_idx" ON "excursion_images"("excursionId");

-- CreateIndex
CREATE UNIQUE INDEX "transport_options_slug_key" ON "transport_options"("slug");

-- CreateIndex
CREATE INDEX "transport_options_type_idx" ON "transport_options"("type");

-- CreateIndex
CREATE INDEX "transport_options_isActive_idx" ON "transport_options"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "transport_availabilities_transportOptionId_date_key" ON "transport_availabilities"("transportOptionId", "date");

-- CreateIndex
CREATE INDEX "transport_bookings_transportOptionId_startDate_endDate_idx" ON "transport_bookings"("transportOptionId", "startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "terrains_slug_key" ON "terrains"("slug");

-- CreateIndex
CREATE INDEX "terrains_isActive_idx" ON "terrains"("isActive");

-- CreateIndex
CREATE INDEX "terrain_images_terrainId_idx" ON "terrain_images"("terrainId");

-- CreateIndex
CREATE INDEX "terrain_documents_terrainId_idx" ON "terrain_documents"("terrainId");

-- CreateIndex
CREATE INDEX "real_estate_inquiries_terrainId_idx" ON "real_estate_inquiries"("terrainId");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_quoteNumber_key" ON "quotes"("quoteNumber");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_token_key" ON "quotes"("token");

-- CreateIndex
CREATE INDEX "quotes_status_idx" ON "quotes"("status");

-- CreateIndex
CREATE INDEX "quotes_clientEmail_idx" ON "quotes"("clientEmail");

-- CreateIndex
CREATE INDEX "quote_items_quoteId_idx" ON "quote_items"("quoteId");

-- CreateIndex
CREATE INDEX "quote_items_itemType_idx" ON "quote_items"("itemType");

-- CreateIndex
CREATE INDEX "email_logs_quoteId_idx" ON "email_logs"("quoteId");

-- AddForeignKey
ALTER TABLE "accommodation_images" ADD CONSTRAINT "accommodation_images_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "season_rates" ADD CONSTRAINT "season_rates_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "excursion_images" ADD CONSTRAINT "excursion_images_excursionId_fkey" FOREIGN KEY ("excursionId") REFERENCES "excursions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_availabilities" ADD CONSTRAINT "transport_availabilities_transportOptionId_fkey" FOREIGN KEY ("transportOptionId") REFERENCES "transport_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_bookings" ADD CONSTRAINT "transport_bookings_transportOptionId_fkey" FOREIGN KEY ("transportOptionId") REFERENCES "transport_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_bookings" ADD CONSTRAINT "transport_bookings_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terrain_images" ADD CONSTRAINT "terrain_images_terrainId_fkey" FOREIGN KEY ("terrainId") REFERENCES "terrains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terrain_documents" ADD CONSTRAINT "terrain_documents_terrainId_fkey" FOREIGN KEY ("terrainId") REFERENCES "terrains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "real_estate_inquiries" ADD CONSTRAINT "real_estate_inquiries_terrainId_fkey" FOREIGN KEY ("terrainId") REFERENCES "terrains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_excursionId_fkey" FOREIGN KEY ("excursionId") REFERENCES "excursions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "transport_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
