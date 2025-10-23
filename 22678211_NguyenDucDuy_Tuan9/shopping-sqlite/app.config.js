export default {
    expo: {
        name: "shopping-sqlite",
        slug: "shopping-sqlite",
        web: {
            bundler: "metro",
            headers: [{
                    key: "Cross-Origin-Opener-Policy",
                    value: "same-origin"
                },
                {
                    key: "Cross-Origin-Embedder-Policy",
                    value: "require-corp"
                }
            ]
        }
    }
};