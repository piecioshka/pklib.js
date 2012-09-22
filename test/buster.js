var config = module.exports;

config["pklib"] = {
    rootPath: "../",
    environment: "browser", // "browser" or "node"
    sources: [
        "src/header.js",
        "src/ui.js",
        "src/*.js",
    ],
    tests: [
        "test/src/*-test.js"
    ]
};
