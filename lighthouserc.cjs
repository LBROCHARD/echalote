module.exports = {
    ci: {
        collect: {
            startServerCommand: "npm run preview",
            startServerReadyPattern: "Local:",
            url: [
                "http://localhost:4173/",
            ],
            numberOfRuns: 1
        },
        assert: {
			"assertions": {
				"accessibility": "warn",
				"performance": "warn",
				"seo": "warn",
				"best-practices": "warn"
			}
		},
        upload: {
            "target": "filesystem",
			"outputDir": "./.lighthouseci/reports"
        },
    },
};
