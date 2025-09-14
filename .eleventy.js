module.exports = function(eleventyConfig) {
    // This setting ensures that Eleventy uses your existing file names,
    // like `home_content.html`, as the output file paths.
    eleventyConfig.addGlobalData("permalink", "{{ page.fileSlug }}.html");
    
    // The `dir` object tells Eleventy where to look for source files and
    // where to write the built site.
    return {
        dir: {
            input: "src",    // All of your source files should be in the `src` folder.
            output: "_site"  // The final, built website will be placed here.
        }
    };
};

