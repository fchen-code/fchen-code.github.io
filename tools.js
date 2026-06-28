function openTool(toolId) {
  document.getElementById("toolModal").style.display = "flex";

  const panels = document.querySelectorAll(".tool-panel");
  panels.forEach(panel => {
    panel.style.display = "none";
  });

  document.getElementById(toolId).style.display = "block";
}

function closeTool() {
  document.getElementById("toolModal").style.display = "none";
}

function findMotif() {
  const sequences = document.getElementById("motifSequenceInput").value.toUpperCase();
  const motif = document.getElementById("motifInput").value.toUpperCase().replace(/\s/g, "");
  const resultBox = document.getElementById("motifResult");
  const lines = sequences.split("\n");
  let sequence = ""
  for (let line of lines) {
        if (line.startsWith(">"))
            continue
        sequence += line.replace(/\s/g, "")
    }
  const base = {
    "A": ["A"],
    "T": ["T"],
    "C": ["C"],
    "G": ["G"],
    "U": ["U"],
    "N": ["A", "T", "U", "C", "G"]
  };

  resultBox.innerHTML = "";

  if (sequence.length === 0 || motif.length === 0) {
    resultBox.innerHTML = "<p>Please enter both sequence and motif</p>";
    return;
  }

  if (sequence.includes("U") && sequence.includes("T")){
    resultBox.innerHTML = "<p>Mixed DNA/RNA detected from sequence, please use either T or U</p>";
    return;
  }

  if (motif.includes("U") && motif.includes("T")) {
    resultBox.innerHTML = "<p>Mixed DNA/RNA detected from motif, please use either T or U</p>";
    return;
  }

  if (motif.length > sequence.length) {
    resultBox.innerHTML = "<p>No Motif Found</p>";
    return;
  }

  let result = false;
  let output = "";

  for (let i = 0; i <= sequence.length - motif.length; i++) {
    let match = true;

    for (let j = 0; j < motif.length; j++) {
      if (!(motif[j] in base)) {
        resultBox.innerHTML = `<p>Invalid motif character: ${motif[j]}</p>`;
        return;
      }

      if (!(sequence[i + j] in base)) {
        resultBox.innerHTML = `<p>Invalid sequence character: ${sequence[i + j]}</p>`;
        return;
      }

      if (!base[motif[j]].includes(sequence[i + j])) {
        match = false;
        break;
      }
    }

    if (match) {
      result = true;
      const start = i + 1;
      const end = i + motif.length;
      const matchedSeq = sequence.slice(i, i + motif.length);

      output += `<p><strong>Position:</strong> ${start} - ${end} &nbsp; <strong>Match:</strong> ${matchedSeq}</p>`;
    }
  }

  if (!result) {
    resultBox.innerHTML = "<p>No Motif Found</p>";
  } else {
    resultBox.innerHTML = output;
  }
}

function gcContent() {
    const sequences = document.getElementById('gcSequenceInput').value.toUpperCase();
    const resultBox = document.getElementById('gcResult');
    const lines = sequences.split("\n")
    resultBox.innerHTML = ""
    let sequence = ""
    let output = ""
    for (let line of lines) {
        if (line.startsWith(">"))
            continue
        sequence += line.replace(/\s/g, "")
    }
    if (sequence.length === 0) {
    resultBox.innerHTML = "<p>Please enter a sequence</p>";
    return;
  }
    const total_length = sequence.length;
    const am_base = ["R", "Y", "S", "W", "K", "M", "B", "D", "H", "V"]
    const g = [...sequence].filter(i => i === "G").length;
    const c = [...sequence].filter(i => i === "C").length;
    const a = [...sequence].filter(i => i === "A").length;
    const t = [...sequence].filter(i => i === "T").length;
    const u = [...sequence].filter(i => i === "U").length;
    const n = [...sequence].filter(i => i === "N").length;
    const am_count = [...sequence].filter(i => am_base.includes(i)).length;
    if (sequence.includes("U") && sequence.includes("T")){
        resultBox.innerHTML = "<p>Mixed DNA/RNA detected, please use either T or U</p>";
        return;
    } else if (sequence.includes("U")){
        const augc = a + u + g + c;
        let au = 0
        let gc = 0
        if (augc != 0) {
            au = (a + u)/augc * 100
            gc = (g + c)/augc * 100
        }
        const not_valid = total_length - augc - n - am_count;
        output = `<p><strong>Type:</strong> RNA <br>
        <strong>Total length:</strong> ${total_length} <br>
        <strong>Valid Bases (A, U, G, C):</strong> ${augc} <br>
        <strong>Ambiguous Bases without N (IUPAC Code):</strong> ${am_count} <br>
        <strong>Not Valid Bases:</strong> "${not_valid}" <br>
        <strong>A count:</strong> ${a} <strong>U count:</strong> ${u} <br>
        <strong>G count:</strong> ${g} <strong>C count:</strong> ${c} <br>
        <strong>N count (Unknown Base):</strong> ${n} <br>
        <strong>AU content:</strong> ${au.toFixed(2)}% <br>
        <strong>GC content:</strong> ${gc.toFixed(2)}%</p>`
        resultBox.innerHTML = output;
    } else {
        const atgc = a + t + g + c;
        let at = 0
        let gc = 0
        if (atgc != 0) {
            at = (a + t)/atgc * 100
            gc = (g + c)/atgc * 100
        }
        const not_valid = total_length - atgc - n - am_count;
        output = `<p><strong>Type:</strong> DNA <br>
        <strong>Total length:</strong> ${total_length} <br>
        <strong>Valid Bases (A, T, G, C):</strong> ${atgc} <br>
        <strong>Ambiguous Bases without N (IUPAC Code):</strong> ${am_count} <br>
        <strong>Not Valid Bases:</strong> "${not_valid}" <br>
        <strong>A count:</strong> ${a} <strong>T count:</strong> ${t} <br>
        <strong>G count:</strong> ${g} <strong>C count:</strong> ${c} <br>
        <strong>N count (Unknown Base):</strong> ${n} <br>
        <strong>AT content:</strong> ${at.toFixed(2)}% <br>
        <strong>GC content:</strong> ${gc.toFixed(2)}%</p>`
        resultBox.innerHTML = output;
    }
}

function seqConverter(test) {
    const sequences = document.getElementById('convertSequenceInput').value.toUpperCase();
    const resultBox = document.getElementById('convertResult');
    const lines = sequences.split("\n")
    resultBox.innerHTML = ""
    let sequence = ""
    let reversed = ""
    let output = ""
    let result = ""
    let not_valid = []
    for (let line of lines) {
        if (line.startsWith(">"))
            continue
        sequence += line.replace(/\s/g, "")
    }
    if (sequence.length === 0) {
        resultBox.innerHTML = "<p>Please enter a sequence</p>";
        return;
    }
    switch (test) {
        case "dnatorna":
            if (sequence.includes("U") && sequence.includes("T")){
                resultBox.innerHTML = "<p>Mixed DNA/RNA detected, please use only T</p>";
                return;
            }
            const dna_rna = {A:"A", T:"U", G:"G", C:"C", N:"N",
                R:"R", Y:"Y", S:"S", W:"W", K:"K",
                M:"M", B:"B", D:"D", H:"H", V:"V"}
            if ([...sequence].some(i => !(i in dna_rna))) {
                not_valid = [...sequence].filter(i => !(i in dna_rna)).join("");
                output = `<p>Invalid Characters "${not_valid}", Please Check</p>`;
            } else {
                for (let base of sequence) {
                    result += dna_rna[base]
                    output = `<p><strong>RNA:</strong> ${result}</p>`;
                }
            }
            break
        
        case "rnatodna":
            if (sequence.includes("U") && sequence.includes("T")){
                resultBox.innerHTML = "<p>Mixed DNA/RNA detected, please use only U</p>";
                return;
            }
            const rna_dna = {A:"A", U:"T", G:"G", C:"C", N:"N",
                R:"R", Y:"Y", S:"S", W:"W", K:"K",
                M:"M", B:"B", D:"D", H:"H", V:"V"}
            if ([...sequence].some(i => !(i in rna_dna))) {
                not_valid = [...sequence].filter(i => !(i in rna_dna)).join("");
                output = `<p>Invalid Characters "${not_valid}", Please Check</p>`;
            } else {
                for (let base of sequence) {
                    result += rna_dna[base]
                    output = `<p><strong>DNA:</strong> ${result}</p>`;
                }
            }
            break
        
        case "reverseco":
            dna_complement = {
                A: "T", T: "A",
                G: "C", C: "G",
                R: "Y", Y: "R",
                S: "S", W: "W",
                K: "M", M: "K",
                B: "V", V: "B",
                D: "H", H: "D",
                N: "N"
            }
            rna_complement = {
                A: "U", U: "A",
                G: "C", C: "G",
                R: "Y", Y: "R",
                S: "S", W: "W",
                K: "M", M: "K",
                B: "V", V: "B",
                D: "H", H: "D",
                N: "N"
            }
            iupac_note = {
                R: "A or G",
                Y: "C or T/U",
                S: "G or C",
                W: "A or T/U",
                K: "G or T/U",
                M: "A or C",
                B: "C or G or T/U",
                D: "A or G or T/U",
                H: "A or C or T/U",
                V: "A or C or G",
                N: "A or C or G or T/U"
            }
            not_valid = [...sequence].filter(i => !(i in dna_complement) && !(i in rna_complement)).join("");
            if (sequence.includes("U") && sequence.includes("T")){
                output = `<p>Mixed DNA/RNA detected, please use either T or U</p>`;

            } else if (not_valid) {
                output = `<p>Invalid Characters "${not_valid}", Please Check</p>`;

            } else if (sequence.includes("U")) {
                reversed = sequence.split("").reverse().join("")
                for (let base of reversed) {
                    result += rna_complement[base]
                    output = `<p><strong>Reverse Complement:</strong> ${result}</p>`;
                }
            } else {
                reversed = sequence.split("").reverse().join("")
                for (let base of reversed) {
                    result += dna_complement[base]
                    output = `<p><strong>Reverse Complement:</strong> ${result}</p>`;
                }
            }
            const iupacBases = new Set(
                [...result].filter(i => i in iupac_note));
                
            if (iupacBases.size > 0) {
                output += `<p><strong>IUPAC Bases Detected:</strong></p>`;
                for (const i of iupacBases) {
                    output += `${i}: ${iupac_note[i]} <br>`;
                }
            }
            break    
        }
    
    resultBox.innerHTML = output;
}

function proConverter () {
    const sequences = document.getElementById('proSequenceInput').value.toUpperCase();
    const resultBox = document.getElementById('proResult');
    const lines = sequences.split("\n")
    resultBox.innerHTML = ""
    let sequence = ""
    let output = ""
    let result = ""
    let not_valid = []
    const valid_list = ["A", "T", "G", "C", "U"]
    const codon_table = {
        UUU: "F", UUC: "F", UUA: "L", UUG: "L",
        UCU: "S", UCC: "S", UCA: "S", UCG: "S",
        UAU: "Y", UAC: "Y", UAA: "*", UAG: "*",
        UGU: "C", UGC: "C", UGA: "*", UGG: "W",
        CUU: "L", CUC: "L", CUA: "L", CUG: "L",
        CCU: "P", CCC: "P", CCA: "P", CCG: "P",
        CAU: "H", CAC: "H", CAA: "Q", CAG: "Q",
        CGU: "R", CGC: "R", CGA: "R", CGG: "R",
        AUU: "I", AUC: "I", AUA: "I", AUG: "M",
        ACU: "T", ACC: "T", ACA: "T", ACG: "T",
        AAU: "N", AAC: "N", AAA: "K", AAG: "K",
        AGU: "S", AGC: "S", AGA: "R", AGG: "R",
        GUU: "V", GUC: "V", GUA: "V", GUG: "V",
        GCU: "A", GCC: "A", GCA: "A", GCG: "A",
        GAU: "D", GAC: "D", GAA: "E", GAG: "E",
        GGU: "G", GGC: "G", GGA: "G", GGG: "G"
    };
    
    function proteinTranslation(seq, codonTable) {
        let codList = [];
        let proResult = "";
        let inResult = "";
        for (let i = 0; i < seq.length; i += 3) {
            codList.push(seq.slice(i, i + 3));
        }
        for (let codon of codList) {
            if (codon.length === 3) {
                proResult += codonTable[codon];
            } else {
                inResult += codon;
            }
        }
        return {
            protein: proResult,
            incomplete: inResult
        };
    }

    for (let line of lines) {
        if (line.startsWith(">"))
            continue
        sequence += line.replace(/\s/g, "")
    }

    not_valid = [...sequence].filter(i => !(valid_list.includes(i))).join("");

    if (sequence.length === 0) {
        resultBox.innerHTML = "<p>Please enter a sequence</p>";
        return;
    }
    if (sequence.includes("T") && sequence.includes("U")) {
        resultBox.innerHTML = "<p>Mixed DNA/RNA detected from motif, please use either T or U</p>";
        return;
    } else if (not_valid) {
        resultBox.innerHTML = `<p>Invalid Characters "${not_valid}", Please Check</p>`;
        return;
    } else if (sequence.includes("T")) {
        sequence = sequence.replace(/T/g, "U");
        result = proteinTranslation(sequence, codon_table)
        if (result.incomplete) {
            output = `<p><strong>Type:</strong> DNA <br>
            <strong>RNA:</strong> ${sequence} <br>
            <strong>Protein:</strong> ${result.protein} <br>
            <strong>Warning:</strong> Incomplete codon "${result.incomplete}" are ignored</p>`
        } else {
            output = `<p><strong>Type:</strong> DNA <br>
            <strong>RNA:</strong> ${sequence} <br>
            <strong>Protein:</strong> ${result.protein}</p>`
        }
    } else {
        result = proteinTranslation(sequence, codon_table)
        if (result.incomplete) {
            output = `<p><strong>Type:</strong> RNA <br>
            <strong>Protein:</strong> ${result.protein} <br>
            <strong>Warning:</strong> Incomplete codon "${result.incomplete}" are ignored</p>`
        } else {
            output = `<p><strong>Type:</strong> RNA <br>
            <strong>Protein:</strong> ${result.protein}</p>`
    }
}

    resultBox.innerHTML = output;
}

async function loadSQLdata() {
  const response = await fetch("data/tnbc_data.csv");
  const text = await response.text();
}

let db;

async function initDatabase() {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
    });
    db = new SQL.Database();

    db.run(`
        CREATE TABLE peaks (
            Chromosome TEXT,
            GeneStart INTEGER,
            GeneEnd INTEGER,
            GeneLength INTEGER,
            ConcTumor REAL,
            ConcNormal REAL,
            Fold REAL,
            FDR REAL,
            Annotation TEXT,
            Symbol TEXT,
            GeneName TEXT,
            Direction TEXT
        );
    `);

    const response = await fetch("data/tnbc_data.csv");
    const text = await response.text();

    const lines = text.trim().split(/\r?\n/);
    const rows = lines.slice(1).map(line => line.split(","));

    const stmt = db.prepare(`
        INSERT INTO peaks (
            Chromosome, GeneStart, GeneEnd, GeneLength, 
            ConcTumor, ConcNormal, Fold, FDR, 
            Annotation, Symbol, GeneName, Direction
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const row of rows) {
        stmt.run([
            row[0],             // chr
            Number(row[1]),     // start
            Number(row[2]),     // end
            Number(row[3]),     // fold_change
            Number(row[4]),     // fdr
            Number(row[5]),     // conc_tumor
            Number(row[6]),     // conc_normal
            Number(row[7]),             // annotation
            row[8],             // gene_symbol
            row[9],            // gene_name
            row[10],
            row[11]             // direction
        ]);
    }

    stmt.free();
}


initDatabase()

function sqlExplorer() {
    const resultBox = document.getElementById("sqlResult");
    const symbol = document.getElementById("geneFilter").value
    const annotation = document.getElementById("annotationFilter").value
    const direction = document.getElementById("directionFilter").value
    const fdr = document.getElementById("fdrFilter").value
    const fold = document.getElementById("foldFilter").value
    const limit = document.getElementById("limitFilter").value
    const sort = document.getElementById("sortFilter").value
    const order = document.getElementById("sortOrder").value

    let output = "SELECT * FROM peaks WHERE GeneLength >= 0"

    if (symbol) {
        output += ` AND Symbol LIKE '%${symbol}%'`;
    }
    if (annotation) {
        output += ` AND Annotation LIKE '%${annotation}%'`;
    }
    if (fdr) {
        output += ` AND FDR <= ${fdr}`;
    }
    if (fold) {
        output += ` AND Fold <= ${fold}`;
    }
    if (direction === "Open") {
        output +=  ` AND Direction = '${direction}'`;
    } else if (direction === "Closed") {
        output += ` AND Direction = '${direction}'`;
    }

    if (sort != "None") {
        output += ` ORDER BY ${sort} ${order}`
    } 

    if (limit != "All") {
        output += ` LIMIT ${limit};`;
    } else {
        output += `;`;
    }

    const result = db.exec(output);

    if (result.length === 0) {
    resultBox.innerHTML = "<p>No results</p>";
    return;
    }
    
    const columns = result[0].columns;
    const values = result[0].values;
    
    let html = "<table border='1'><tr>";
    
    for (let col of columns) {
        html += `<th>${col}</th>`;
    }

    html += "</tr>";

    for (let row of values) {
        html += "<tr>";
        for (let cell of row) {
            html += `<td>${cell}</td>`;
        }
        
        html += "</tr>";
    }
    
    html += "</table>";
    
    resultBox.innerHTML = html;

}

async function runBlast() {
    
    async function loadDatabase() {
        const response = await fetch("data/database.json");
        const database = await response.json();
        return database;
    }
    const resultBox = document.getElementById("blastResult");
    const database = await loadDatabase();
    const sequences = document.getElementById('blastSequenceInput').value.toUpperCase();
    let sequence = "";
    const lines = sequences.split("\n")
    for (let line of lines) {
        if (line.startsWith(">"))
            continue
        sequence += line.replace(/\s/g, "")
    }
    const kmer = parseInt(document.getElementById("blastKmer").value) || 8;
    const score = parseInt(document.getElementById("blastScore").value) || 70;
    const limit = parseInt(document.getElementById("blastLimit").value) || 5;
    
    if(!sequences) {
        resultBox.innerHTML = "Please enter a sequence to run BLAST.";
        return;
    }

    if(sequence.length < kmer) {
        resultBox.innerHTML = "Please ajust the k-mer value to match sequence length.";
        return;
    }

    function k_mer(seq = sequence, k = kmer) {
        const kmerList = [];
        for (let i = 0; i <= seq.length - k; i++) {
            kmerList.push(seq.slice(i, i + k));
        }

        return kmerList;
    }

    function kmer_search(kmers, data = database) {
        const info = [];
            for (const i in data) {
                const sequence = data[i];
                kmers.forEach((kmer, n) => {
                    for (let k = 0; k <= sequence.length - kmer.length; k++) {
                        const sl = sequence.slice(k, k + kmer.length);
                        
                        if (sl === kmer) {
                            info.push({
                                gene: i,
                                kmer_position: n,
                                kmer: kmer,
                                position: k
                            });
                        }
                    }
                });
            }
            
            return info;
        }
    
    function kmer_extract(info, data = database, seq = sequence) {
        const valid_info = [];
        for (const i of info) {
            const gene_name = i.gene;
            const gene_seq = data[gene_name];
            const seq_len = seq.length;
            const start = i.position - i.kmer_position;
            if (start < 0 || start + seq_len > gene_seq.length) {
                continue;
            }
            
            const region = gene_seq.slice(start, start+seq_len);
            
            valid_info.push({
                ...i,
                region: region,
                start: start,
                end: start + seq_len,
                sequence: seq
                });
        }
        return valid_info;
    }


    function score_cal(info) {
        const score_info = [];
        for (const i of info) {
            let score = 0;
            let line = "";
            const len_seq = i.sequence.length;
            const len_region = i.region.length;
            for (let r = 0; r < len_region; r++) {
                if (i.region[r] === i.sequence[r]) {
                    score += 1;
                    line += "|"
                } else {
                    score -= 1;
                    line += " ";
                }
            }
            const matches = line.split("|").length - 1
            score_info.push({
                ...i,
                score: score,
                line: line,
                matches: matches,
                identity: (matches / len_seq) * 100
            });
        }
        return score_info;
    }

    function duplicate_removal(info, k = kmer) {
        info.sort((a, b) => b.score - a.score);
        const unique_info = [];
        for (const i of info) {
            let duplicate = false;
            for (const j of unique_info) {
                const same_gene = i.gene === j.gene;
                const nearby = Math.abs(i.start - j.start) <= k;
                if (same_gene && nearby) {
                    duplicate = true;
                    break;
                }
            }
            if (!duplicate) {
                unique_info.push(i);
            }
        }
        return unique_info;
    }

    function resultOutput(info, top = limit, minIdentity = score) {
        
        const sorted = [...info].sort((a, b) => b.score - a.score);
        const filtered = sorted.filter(i => i.identity >= minIdentity);
        const strong = filtered.slice(0, top);

        if (strong.length === 0) {
            resultBox.innerHTML = "No strong matches found.";
            return;
        }
        let output = "";
        for (const i of strong) {
            output += `
            <p><strong>Gene:</strong> ${i.gene}</p>
            <p><strong>Score:</strong> ${i.score}</p>
            <p><strong>Identity:</strong> ${i.identity.toFixed(2)}%</p>
            <p><strong>Position:</strong> ${i.start}-${i.end}</p>
            <pre>
            <strong>Query:</strong>  ${i.sequence}
                    ${i.line}
            <strong>Target:</strong> ${i.region}
            </pre>
            <hr>`
        };
        resultBox.innerHTML = output;
    }
    const kmers = k_mer(sequence, kmer);
    const hits = kmer_search(kmers, database);
    const extracted = kmer_extract(hits, database, sequence);
    const scored = score_cal(extracted);
    const unique = duplicate_removal(scored, kmer);
    resultOutput(unique, limit, score);
}

function findKmer() {
    const sequences = document.getElementById("kmerSequenceInput").value.toUpperCase();
    const kmer = parseInt(document.getElementById("sizeKmer").value);
    let output = "";
    let sequence = "";
    const resultBox = document.getElementById("kmerResult")
    const lines = sequences.split("\n")
    for (let line of lines) {
        if (line.startsWith(">"))
            continue
        sequence += line.replace(/\s/g, "")
    }
    if (!sequences) {
        resultBox.innerHTML = "Please enter a sequence.";
        return;
    }
    function k_mer(seq = sequence, k = kmer) {
        const kmerList = [];
        for (let i = 0; i <= seq.length - k; i++) {
            kmerList.push(seq.slice(i, i + k));
        }

        resultBox.innerHTML = `<p><strong>Result:</strong> ${kmerList}</p>`;
    }

    k_mer();
}

function repeat(k, sequence) {
    const result = [];

    for (let i = 0; i <= sequence.length - k; i++) {
        result.push(sequence.slice(i, i + k));
    }

    return result;
}

function findRepeat() {
    const sequences = document.getElementById("repeatSequenceInput").value.toUpperCase().replace(/\s/g, "");
    const ks = parseInt(document.getElementById("repeatLength").value);
    const resultBox = document.getElementById("repeatResult");

    if (!sequences) {
        resultBox.innerHTML = "Please enter a sequence.";
        return;
    }
    let sequence = "";
    const lines = sequences.split("\n")
    for (let line of lines) {
        if (line.startsWith(">"))
            continue
        sequence += line.replace(/\s/g, "")
    }
    if (!ks || ks < 1 || ks > sequence.length) {
        resultBox.innerHTML = "Please enter a valid repeat length.";
        return;
    }

    // Regular repeat finder
    const custom = repeat(ks, sequence);

    const validRepeat = [...new Set(custom)].filter(base => {
        return custom.filter(x => x === base).length >= 2;
    });

    const locations = {};

    for (let base of validRepeat) {
        locations[base] = [];

        custom.forEach((x, n) => {
            if (x === base) {
                locations[base].push(`${n + 1} - ${n + ks}`);
            }
        });
    }

    let output = "<h3>Regular Repeats</h3>";

    if (Object.keys(locations).length === 0) {
        output += "<p>No regular repeats found.</p>";
    } else {
        for (let base in locations) {
            output += `<p><strong>Base:</strong> ${base}<br>
                       <strong>Locations:</strong> ${locations[base].join(", ")}</p>`;
        }
    }

    const tandemResult = [];

    for (let j = 0; j < sequence.length; j++) {
        for (let i = 2; i < sequence.length; i++) {
            let copies = 1;
            let jump = 1;

            const current = sequence.slice(j, j + i);
            let nextOne = sequence.slice(j + jump * i, j + (jump + 1) * i);

            if (current === nextOne && current.length === i && nextOne.length === i) {
                copies = 2;

                while (current === nextOne) {
                    jump += 1;
                    nextOne = sequence.slice(j + jump * i, j + (jump + 1) * i);

                    if (current === nextOne) {
                        copies += 1;
                    }
                }

                tandemResult.push({
                    motif: current,
                    copies: copies,
                    start: j + 1,
                    end: j + current.length * copies,
                    length: current.length * copies
                });
            }
        }
    }

    output += "<h3>Tandem Repeats</h3>";

    if (tandemResult.length > 0) {
        tandemResult.sort((a, b) => a.start - b.start);

        const finalResult = [];
        let currentBest = tandemResult[0];

        for (let i = 1; i < tandemResult.length; i++) {
            const b = tandemResult[i];

            if (currentBest.start <= b.end && currentBest.end >= b.start) {
                if (b.length > currentBest.length) {
                    currentBest = b;
                }
            } else {
                finalResult.push(currentBest);
                currentBest = b;
            }
        }

        finalResult.push(currentBest);

        for (let item of finalResult) {
            output += `<p>
                <strong>Motif:</strong> ${item.motif}<br>
                <strong>Copies:</strong> ${item.copies}<br>
                <strong>Start:</strong> ${item.start}<br>
                <strong>End:</strong> ${item.end}<br>
                <strong>Length:</strong> ${item.length}
            </p>`;
        }
    } else {
        output += "<p>No tandem repeats found.</p>";
    }

    resultBox.innerHTML = output;
}




function splitSequence(sequence, jump) {
    const splitList = [];

    for (let i = 0; i <= sequence.length - 3 - jump; i += 3) {
        splitList.push(sequence.slice(i + jump, i + jump + 3));
    }

    return splitList;
}

function checkORF(codons) {
    const finalOutput = [];
    const stopCodons = ["TAA", "TAG", "TGA"];

    for (let n = 0; n < codons.length; n++) {
        if (codons[n] === "ATG") {
            let output = "ATG";

            for (let j = n + 1; j < codons.length; j++) {
                if (!stopCodons.includes(codons[j])) {
                    output += codons[j];
                } else {
                    output += codons[j];
                    finalOutput.push(output);
                    break;
                }
            }
        }
    }

    return finalOutput;
}


function findOrf() {
    const sequences = document.getElementById("orfSequenceInput").value.toUpperCase().replace(/\s/g, "");
    const resultBox = document.getElementById("orfResult");
    let output = ""
    if (!sequences) {
        resultBox.innerHTML = "Please enter a sequence.";
        return;
    }
    let sequence = "";
    const lines = sequences.split("\n")
    for (let line of lines) {
        if (line.startsWith(">"))
            continue
        sequence += line.replace(/\s/g, "")
    }
    const orfs = [];

    for (let i = 0; i < 3; i++) {
        orfs.push(splitSequence(sequence, i));
}

for (let n = 0; n < orfs.length; n++) {

    const result = checkORF(orfs[n]);

    output += `<div class="orf-frame">`;

    output += `<h3>Frame ${n + 1}</h3>`;

    if (result.length > 0) {

        for (let k = 0; k < result.length; k++) {

            output += `
            <div class="orf-card">
                <p><strong>ORF ${k + 1}</strong></p>
                <p><strong>Sequence:</strong> ${result[k]}</p>
                <p><strong>Length:</strong> ${result[k].length} bp</p>
            </div>
            `;
        }

    } else {

        output += `<p>No ORFs found.</p>`;
    }

    output += `</div>`;
}

resultBox.innerHTML = output;
}



function single(seq) {
    return seq.split("");
}
function score(result) {
    let line = "";

    for (let i = 0; i < result[0].length; i++) {
        line += result[0][i] === result[1][i] ? "|" : " ";
    }

    const identical = line.split("|").length - 1;
    const identityScore = (identical / line.length) * 100;

    return {
        line: line,
        identityScore: identityScore
    };
}

function globalAlignment(){
    const sequences1 = document.getElementById("globalSequenceInput1").value.toUpperCase().replace(/\s/g, "");
    const sequences2 = document.getElementById("globalSequenceInput2").value.toUpperCase().replace(/\s/g, "");
    const resultBox = document.getElementById("globalResult");
    let output = ""
    if (!sequences1 || !sequences2){
        resultBox.innerHTML = "Please enter sequences";
        return;
    }
    let sequence1 = "";
    const lines1 = sequences1.split("\n")
    for (let line of lines1) {
        if (line.startsWith(">"))
            continue
        sequence1 += line.replace(/\s/g, "")
    }
    let sequence2 = "";
    const lines2 = sequences2.split("\n")
    for (let line of lines2) {
        if (line.startsWith(">"))
            continue
        sequence2 += line.replace(/\s/g, "")
    }
    function createMatrix(seq1, seq2, gapPen = -2) {
    const result = [];

    for (let i = 0; i < seq1.length + 1; i++) {
        const row = [];

        if (i === 0) {
            for (let x = 0; x > (seq2.length + 1) * gapPen; x += gapPen) {
                row.push(x);
            }
        } else {
            for (let j = 0; j < seq2.length + 1; j++) {
                if (j === 0) {
                    row.push(i * gapPen);
                } else {
                    row.push(0);
                }
            }
        }

        result.push(row);
    }

    return result;
}

function calculation(seq1, seq2, matrix) {
    const gap = -2;
    const mismatch = -1;
    const match = 2;

    for (let i = 0; i < seq1.length; i++) {
        for (let j = 0; j < seq2.length; j++) {
            const diagonal = matrix[i][j];
            const up = matrix[i][j + 1];
            const left = matrix[i + 1][j];

            const score = seq1[i] === seq2[j] ? match : mismatch;

            matrix[i + 1][j + 1] = Math.max(
                diagonal + score,
                up + gap,
                left + gap
            );
        }
    }

    return matrix;
}

function traceback(seq1, seq2, matrix) {
    let resultSeq1 = "";
    let resultSeq2 = "";

    let row = matrix.length - 1;
    let column = matrix[0].length - 1;

    while (row !== 0 || column !== 0) {
        const diagonal = matrix[row - 1]?.[column - 1];
        const up = matrix[row - 1]?.[column];
        const left = matrix[row]?.[column - 1];

        if (row === 0) {
            resultSeq1 += "-";
            resultSeq2 += seq2[column - 1];
            column -= 1;
        } else if (column === 0) {
            resultSeq1 += seq1[row - 1];
            resultSeq2 += "-";
            row -= 1;
        } else {
            const score = seq1[row - 1] === seq2[column - 1] ? 2 : -1;

            if (matrix[row][column] === diagonal + score) {
                resultSeq1 += seq1[row - 1];
                resultSeq2 += seq2[column - 1];
                row -= 1;
                column -= 1;
            } else if (matrix[row][column] === up - 2) {
                resultSeq1 += seq1[row - 1];
                resultSeq2 += "-";
                row -= 1;
            } else if (matrix[row][column] === left - 2) {
                resultSeq1 += "-";
                resultSeq2 += seq2[column - 1];
                column -= 1;
            }
        }
    }

    return [
        resultSeq1.split("").reverse().join(""),
        resultSeq2.split("").reverse().join("")
    ];
}

    const s1 = single(sequence1);
    const s2 = single(sequence2);
    const filledMatrix = createMatrix(s1, s2);
    const calculatedMatrix = calculation(s1, s2, filledMatrix);
    const finalResult = traceback(s1, s2, calculatedMatrix);
    const finalScore = score(finalResult);
    output += `
    <p><strong>Alignment Score:</strong> ${calculatedMatrix[calculatedMatrix.length - 1][calculatedMatrix[0].length - 1]}</p>
    <p><strong>Identity Score:</strong> ${finalScore.identityScore.toFixed(2)}%</p>
    <pre>
    <strong>Sequence 1:</strong> ${finalResult[0]}
                ${finalScore.line}
    <strong>Sequence 2:</strong> ${finalResult[1]}
    </pre>
    `;
    resultBox.innerHTML = output;
}

function localAlignment(){
    const sequences1 = document.getElementById("localSequenceInput1").value.toUpperCase().replace(/\s/g, "");
    const sequences2 = document.getElementById("localSequenceInput2").value.toUpperCase().replace(/\s/g, "");
    const resultBox = document.getElementById("localResult");
    let output = ""
    if (!sequences1 || !sequences2){
        resultBox.innerHTML = "Please enter sequences";
        return;
    }
    let sequence1 = "";
    const lines1 = sequences1.split("\n")
    for (let line of lines1) {
        if (line.startsWith(">"))
            continue
        sequence1 += line.replace(/\s/g, "")
    }
    let sequence2 = "";
    const lines2 = sequences2.split("\n")
    for (let line of lines2) {
        if (line.startsWith(">"))
            continue
        sequence2 += line.replace(/\s/g, "")
    }
    function createMatrix(seq1, seq2) {
    const result = [];

    for (let i = 0; i < seq1.length + 1; i++) {
        const row = [];

        for (let j = 0; j < seq2.length + 1; j++) {
            row.push(0);
        }

        result.push(row);
    }

    return result;
}

function calculation(seq1, seq2, matrix) {
    const gap = -2;
    const mismatch = -1;
    const match = 2;

    for (let i = 0; i < seq1.length; i++) {
        for (let j = 0; j < seq2.length; j++) {
            const diagonal = matrix[i][j];
            const up = matrix[i][j + 1];
            const left = matrix[i + 1][j];

            const score = seq1[i] === seq2[j] ? match : mismatch;

            matrix[i + 1][j + 1] = Math.max(
                diagonal + score,
                up + gap,
                left + gap,
                0
            );
        }
    }

    return matrix;
}

function highest(calculatedMatrix) {
    let high = calculatedMatrix[0][0];

    const info = {
        highest: high,
        row: 0,
        column: 0
    };

    for (let n = 0; n < calculatedMatrix.length; n++) {
        for (let z = 0; z < calculatedMatrix[n].length; z++) {
            if (high < calculatedMatrix[n][z]) {
                high = calculatedMatrix[n][z];
                info.highest = calculatedMatrix[n][z];
                info.row = n;
                info.column = z;
            }
        }
    }

    return info;
}

function traceback(seq1, seq2, calculatedMatrix, scoreInfo) {
    let row = scoreInfo.row;
    let column = scoreInfo.column;

    let resultSeq1 = "";
    let resultSeq2 = "";

    while (calculatedMatrix[row][column] !== 0) {
        const diagonal = calculatedMatrix[row - 1][column - 1];
        const up = calculatedMatrix[row - 1][column];
        const left = calculatedMatrix[row][column - 1];

        const score = seq1[row - 1] === seq2[column - 1] ? 2 : -1;

        if (calculatedMatrix[row][column] === diagonal + score) {
            resultSeq1 += seq1[row - 1];
            resultSeq2 += seq2[column - 1];
            row -= 1;
            column -= 1;
        } else if (calculatedMatrix[row][column] === up - 2) {
            resultSeq1 += seq1[row - 1];
            resultSeq2 += "-";
            row -= 1;
        } else if (calculatedMatrix[row][column] === left - 2) {
            resultSeq1 += "-";
            resultSeq2 += seq2[column - 1];
            column -= 1;
        }
    }

    return [
        resultSeq1.split("").reverse().join(""),
        resultSeq2.split("").reverse().join("")
    ];
}
    const s1 = single(sequence1);
    const s2 = single(sequence2);
    const filledMatrix = createMatrix(s1, s2);
    const calculatedMatrix = calculation(s1, s2, filledMatrix);
    const highestInfo = highest(calculatedMatrix);
    const finalAlignment = traceback(s1, s2, calculatedMatrix, highestInfo);
    const finalScore = score(finalAlignment);
    output += `
    <p><strong>Alignment Score:</strong> ${calculatedMatrix[calculatedMatrix.length - 1][calculatedMatrix[0].length - 1]}</p>
    <p><strong>Identity Score:</strong> ${finalScore.identityScore.toFixed(2)}%</p>
    <pre>
    <strong>Sequence 1:</strong> ${finalAlignment[0]}
                ${finalScore.line}
    <strong>Sequence 2:</strong> ${finalAlignment[1]}
    </pre>
    `;
    resultBox.innerHTML = output;
}


function dotViewer(){
    const sequences1 = document.getElementById("dotSequenceInput1").value.toUpperCase().replace(/\s/g, "");
    const sequences2 = document.getElementById("dotSequenceInput2").value.toUpperCase().replace(/\s/g, "");
    const window = parseInt(document.getElementById("plotWindow").value);
    const resultBox = document.getElementById("dotResult");
    let output = ""
    if (!sequences1 || !sequences2){
        resultBox.innerHTML = "Please enter sequences";
        return;
    }
    let sequence1 = "";
    const lines1 = sequences1.split("\n")
    for (let line of lines1) {
        if (line.startsWith(">"))
            continue
        sequence1 += line.replace(/\s/g, "")
    }
    let sequence2 = "";
    const lines2 = sequences2.split("\n")
    for (let line of lines2) {
        if (line.startsWith(">"))
            continue
        sequence2 += line.replace(/\s/g, "")
    }

    if (window > sequence1.length || window > sequence2.length){
        resultBox.innerHTML = "Window size cannot be larger than the length of either sequence"
        return;
    }

    function windowSeq(seq, size = 3) {
        const result = [];
        for (let i = 0; i <= seq.length - size; i++) {
            result.push(seq.slice(i, i + size));
        }
        return result;
    }

    function compare(list1, list2) {
        const poss = [];

        for (let i = 0; i < list1.length; i++) {
            for (let j = 0; j < list2.length; j++) {
                if (list1[i] === list2[j]) {
                    poss.push([i, j]);
                }
            }
        }
        return poss;
    }

    function plot(posList) {
        const x = posList.map(p => p[0]);
        const y = posList.map(p => p[1]);

        const traces = [{
            x: x,
            y: y,
            mode: "markers",
            type: "scatter",
            name: "Matches"
        }];

        const score = {};

        for (const point of posList) {
            const diagonal = point[1] - point[0];
            if (!score[diagonal]) {
                score[diagonal] = [];
            }

            score[diagonal].push(point);
        }

        for (const group of Object.values(score)) {
            let coordinates = [];
            const sortedList = group.sort((a, b) => a[0] - b[0]);

            for (let i = 0; i < sortedList.length - 1; i++) {
                const current = sortedList[i];
                const nextOne = sortedList[i + 1];
                
                if (current[0] + 1 === nextOne[0] && current[1] + 1 === nextOne[1]) {
                    if (coordinates.length > 0) {
                        coordinates.push(nextOne);
                    } else {
                        coordinates.push(current);
                        coordinates.push(nextOne);
                    }
                } else {
                    if (coordinates.length > 0) {
                        traces.push({
                            x: coordinates.map(p => p[0]),
                            y: coordinates.map(p => p[1]),
                            mode: "lines",
                            type: "scatter",
                            showlegend: false
                        });
                        coordinates = [];
                    }
                }
            }

            if (coordinates.length > 0) {
                traces.push({
                    x: coordinates.map(p => p[0]),
                    y: coordinates.map(p => p[1]),
                    mode: "lines",
                    type: "scatter",
                    showlegend: false
                });
            }
        }
        
        const layout = {
            title: {
                text: "Dot Plot",
                y: 0.95
            },
            margin: {
                t: 120,
                l: 50,
                r: 80,
                b: 50
            },
            xaxis: {
                title: "Sequence 1",
                side: "top",
                range: [-0.5, list1.length - 0.5],
                showgrid: false
            },
            yaxis: {
                title: "Sequence 2",
                side: "right",
                range: [list2.length - 0.5, -0.5],
                showgrid: false
            }
        };
        Plotly.newPlot("dotplot", traces, layout, {responsive: true});    
    }

const list1 = windowSeq(sequence1, window);
const list2 = windowSeq(sequence2, window);
const posList = compare(list1, list2);

plot(posList);
}
