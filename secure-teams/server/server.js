import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(`listening on port ${process.env.PORT}`);
			console.log("Connected to Database");
		});
	})
	.catch((error) => {
		console.log(error);
	});

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	role: {
		type: String,
		required: true,
		enum: ["team-member", "team-lead", "manager", "admin"],
	},
	teams: { type: Array },
});

const User = mongoose.model("User", userSchema);

app.post("/api/signup", async (req, res) => {
	const { name, email, password, role } = req.body;
	try {
		let user = await User.findOne({ email: email });
		if (user) {
			console.log("User already exists");
			return res.status(400).json({ message: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		user = new User({ name, email, password: hashedPassword, role });
		await user.save();
		res.status(201).json({ message: "User created successfully" });
		console.log("User created successfully");
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error creating user" });
	}
});

app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			console.log("User not found");
			return res.status(400).json({ message: "User not found" });
		}
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			console.log("Invalid password");
			return res.status(400).json({ message: "Invalid password" });
		}
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
    
		res.status(200).json({ token: token });
		console.log("Login successful");
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error logging in" });
	}
});
