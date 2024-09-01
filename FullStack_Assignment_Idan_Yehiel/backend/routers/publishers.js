import express from "express";
import { publishers, saveDatabase } from "../server.js";

const publishersRouter = express.Router();

publishersRouter.get("/", (req, res) => {
    res.status(200).json(publishers);
});

publishersRouter.post("/", (req, res) => {
    const publisherName = req.body.publisher;
    const publisher = publishers.find(
        (existsPublisher) =>
            existsPublisher.publisher.toLowerCase() === publisherName.toLowerCase()
    );

    if (publisher) {
        return res
            .status(400)
            .json({errorMessage: "The publisher already exist"});
    }

    const newPublisher = {
        publisher: publisherName,
        domains: [],
    };

    publishers.unshift(newPublisher);
    saveDatabase();
    res.status(200).json(newPublisher);
});

publishersRouter.delete("/:publisherName", (req, res) => {
    const publisherName = req.params.publisherName;
    const publisherIndex = publishers.findIndex(
        (existsPublisher) =>
            existsPublisher.publisher.toLowerCase() === publisherName
    );

    if (publisherIndex !== -1) {
        const [deletedPublisher] = publishers.splice(publisherIndex, 1);
        saveDatabase();
        return res.status(201).json(deletedPublisher);
    }else{
      return res
          .status(400)
          .json({errorMessage: "Publisher not found"});
    }
});

export default publishersRouter;
