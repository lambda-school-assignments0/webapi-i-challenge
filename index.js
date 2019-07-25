const express = require("express");
const db = require("./data/db");
const server = express();

server.use(express.json());

server.post("/api/users", (req, res) => {
    // POST /api/users
    const userInfo = req.body;

    if (userInfo.name && userInfo.bio) {
        db.insert(userInfo)
            .then(inserted => {
                res.status(201).json({ userInfo });
            })
            .catch(err => {
                res.status(500).json({
                    error:
                        "There was an error while saving the user to the database."
                });
            });
    } else {
        res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        });
    }
});

server.get("/api/users", (req, res) => {
    // GET /api/users
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({
                error: "The users information could not be retrieved."
            });
        });
});

server.get("/api/users/:id", (req, res) => {
    // GET /api/users/<id>
    const { id } = req.params;

    db.findById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({
                    message: "The user with the specified ID does not exist."
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: "The user information could not be retrieved."
            });
        });
});

server.put("/api/users/:id", (req, res) => {
    // PUT /api/users/<id>
    const { id } = req.params;
    const userInfo = req.body;

    if (userInfo.name && userInfo.bio) {
        db.update(id, userInfo)
            .then(updated => {
                if (updated) {
                    res.status(200).json(userInfo);
                } else {
                    res.status(404).json({
                        message:
                            "The user with the specified ID does not exist."
                    });
                }
            })
            .catch(err => {
                res.status(500).json({
                    error: "The user information could not be modified"
                });
            });
    } else {
        res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        });
    }
});

server.delete("/api/users/:id", (req, res) => {
    // DELETE /api/users/<id>
    const { id } = req.params;

    db.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(204).json(deleted);
            } else {
                res.status(404).json({
                    message: "The user with the specified ID does not exist."
                });
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The user could not be removed" });
        });
});

server.listen(4000, () => {
    console.log("server listening on port 4000");
});
