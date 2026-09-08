import { hashPassword, verifyPassword } from "../lib/auth/password.server";

async function main() {
  const password = "A secure test password!42";
  const hash = await hashPassword(password);

  if (hash === password || !hash.startsWith("scrypt$")) {
    throw new Error("Password hashing did not produce a salted scrypt hash.");
  }
  if (!(await verifyPassword(password, hash))) {
    throw new Error("Correct password was rejected.");
  }
  if (await verifyPassword("wrong password", hash)) {
    throw new Error("Incorrect password was accepted.");
  }

  console.log("Auth hashing tests passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
