import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root=process.cwd();
const manifestPath=path.join(root,"assets","sovereign-mirror-manifest.json");
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));

if(manifest.schema!=="khaemenes-sovereign-mirror/v1") throw new Error("Unexpected sovereign mirror manifest schema.");
if(!Array.isArray(manifest.assets)||manifest.assets.length===0) throw new Error("Sovereign mirror manifest has no assets.");

const seen=new Set();
for(const asset of manifest.assets){
 if(!asset.path||!asset.source_repository||!asset.source_path||!asset.source_blob_sha) throw new Error("Incomplete sovereign mirror record.");
 if(seen.has(asset.path)) throw new Error(`Duplicate sovereign mirror record: ${asset.path}`);
 seen.add(asset.path);
 const full=path.join(root,asset.path);
 if(!fs.existsSync(full)) throw new Error(`Missing sovereign mirror: ${asset.path}`);
 const stat=fs.statSync(full);
 if(!stat.isFile()||stat.size===0) throw new Error(`Invalid sovereign mirror: ${asset.path}`);
 if(!/^[0-9a-f]{40}$/i.test(asset.source_blob_sha)) throw new Error(`Invalid source blob SHA: ${asset.path}`);
 const sha256=crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex");
 if(asset.local_sha256 && asset.local_sha256!==sha256) throw new Error(`Local mirror integrity mismatch: ${asset.path}`);
 if(!asset.local_sha256) console.log(`INFO ${asset.path} sha256=${sha256}`);
 console.log(`PASS ${asset.path} <- ${asset.source_repository}@${asset.source_blob_sha}`);
}
console.log(`SOVEREIGN_MIRROR_MANIFEST_PASS assets=${manifest.assets.length}`);
