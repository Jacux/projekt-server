const loginUser  = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Brak adresu e-mail lub hasła" });
        }

        const user = await User.findOne({email});
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Nieprawidłowe dane logowania" });
        }

        const token = jwt.sign({id: user._id}, process.env.secret, {expiresIn: '730h'});
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};