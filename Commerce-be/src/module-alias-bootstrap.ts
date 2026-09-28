import moduleAlias from "module-alias";
import path from "path";

moduleAlias.addAliases({
    "@root": path.join(__dirname, ".."),
    "@modules": path.join(__dirname, "modules"),
    "@share": path.join(__dirname, "share"),
});
