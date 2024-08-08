import User from "../models/userModel.js";

const seedAdmin = async () => {
  const existingAdmin = await User.findOne({ email: "johndoe@gmail.com" });
  if (!existingAdmin) {
    const admin = await User.create({
      name: "Khiyanat",
      email: "khiyanat@deori.com",
      password: "Thirtysevenbillion@37",
      role: "admin",
    });
    try {
      await admin.save();
      console.log("Admin user seeded successfully!");
    } catch (error) {
      console.error("Error seeding admin user:", error);
    }
  } else {
    console.log("Admin user already exists.");
  }
};

export default seedAdmin;
