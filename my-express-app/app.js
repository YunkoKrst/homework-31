const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Змінюйте це значення на ваше з'єднання MongoDB Atlas
const mongoURI ="mongodb+srv://myUser:myPassword@cluster0.wdeui.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0";;

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json());

// Модель для користувачів
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const User = mongoose.model('Users', userSchema);

// GET / - Поверніть дані з будь-якого документу з БД
app.get('/', async (req, res) => {
    try {
        const data = await User.findOne(); // Отримати перший документ
        res.json(data);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET /users - Відповідайте масивом JSON із об'єктами користувачів
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'id name email'); // Отримати всіх користувачів
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET /users/:id - Відповідайте користувачем за id
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});