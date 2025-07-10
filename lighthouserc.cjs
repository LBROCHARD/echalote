module.exports = {
    ci: {
        collect: {
            startServerCommand: "npm run start",
            startServerReadyPattern: "Local:",
            url: [
                "http://localhost:5173/",
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
