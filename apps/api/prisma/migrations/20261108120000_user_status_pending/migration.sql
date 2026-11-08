-- Self-service sign-up: new users wait in "pending" until an HOD or admin approves them.
ALTER TYPE "UserStatus" ADD VALUE 'pending';
