-- Any HOD now approves any request; new requests have no department.
ALTER TABLE "trip_requests" ALTER COLUMN "department_id" DROP NOT NULL;
