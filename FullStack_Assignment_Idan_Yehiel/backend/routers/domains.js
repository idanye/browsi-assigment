import express from "express";
import { publishers, domains } from "../server.js";
import { saveDatabase } from "../server.js";

const domainsRouter = express.Router();

domainsRouter.get("/", (req, res) => {
    res.status(200).json(domains);
});

domainsRouter.get("/:publisherName", (req, res) => {
    const publisherName = req.params.publisherName.toLowerCase();
    const publisher = publishers.find(
        existsPublisher => existsPublisher.publisher.toLowerCase() === publisherName
    );

    if (publisher) {
        const publisherDomains = domains.filter(
            domain => 
                domain.publisherId === publisher.id
        );
        
        return res.status(200).json(publisherDomains);
    } else {
        return res.status(404).json({ errorMessage: "Publisher not found" });
    }

});

domainsRouter.post("/:publisherName", (req, res) => {
    const publisherName = req.params.publisherName.toLowerCase();
    const { domainUrl } = req.body;

    const publisher = publishers.find(
        existsPublisher => existsPublisher.publisher.toLowerCase() === publisherName
    );

    if (!publisher) {
        return res.status(400).json({ errorMessage: "Publisher not found" });
    }

    const domainExists = publisher.domains.some(
        domain => domain.url.toLowerCase() === domainUrl.toLowerCase()
    );

    if (domainExists) {
        return res.status(400).json({ errorMessage: "The domain already exists" });
    }

    const newDomain = {
        url: domainUrl,
        desktopAds: 0,
        mobileAds: 0,
    };

    publisher.domains.push(newDomain);
    domains.push(newDomain);
    saveDatabase();
    res.status(200).json(newDomain);
});

domainsRouter.delete("/:publisherName/:domainUrl", (req, res) => {
    const publisherName = req.params.publisherName.toLowerCase();
    const domainUrl = req.params.domainUrl.toLowerCase();

    const publisher = publishers.find(
        existsPublisher => existsPublisher.publisher.toLowerCase() === publisherName
    );

    if (!publisher) {
        return res.status(400).json({ errorMessage: "Publisher not found" });
    }

    const domainIndex = publisher.domains.findIndex(
        domain => domain.url.toLowerCase() === domainUrl
    );

    if (domainIndex !== -1) {
        const [deletedDomain] = publisher.domains.splice(domainIndex, 1);
        saveDatabase();
        return res.status(201).json(deletedDomain);
    } else {
        return res.status(400).json({ errorMessage: "Domain not found" });
    }
});

export default domainsRouter;
