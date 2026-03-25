class LessonTaskValidators {
    normalizeCode(str) {
        return String(str)
            .replace(/\s+/g, "")
            .trim();
    }

    validateRangeRules(taskId, input) {
        const rangeTasks = new Set([
            "2-1",
            "3-1",
            "3-2",
            "5-1",
            "6-1",
            "6-2",
            "6-3",
            "6-4"
        ]);

        if (!rangeTasks.has(taskId)) {
            return "ok";
        }

        const decimalRegex = /-?\d+\.\d+/;
        if (decimalRegex.test(input)) {
            return "❌ Csak egész számokat használhatsz (nem lehet tizedes).";
        }

        if (taskId === "2-1" || taskId === "3-1") {
            const varRegex =
                /\b(let|const)\s+kor\s*=\s*([^;\n]+)/g;
            let match;

            while ((match = varRegex.exec(input)) !== null) {
                const raw = match[2].trim();

                if (!/^-?\d+$/.test(raw)) {
                    return "❌ Ide csak számot lehet írni.";
                }

                const n = parseInt(raw, 10);
                if (n < 0 || n > 99) {
                    return "❌ Ebben a feladatban a számnak 0 és 99 között kell lennie.";
                }
            }
        }

        if (
            taskId === "6-1" ||
            taskId === "6-2" ||
            taskId === "6-3" ||
            taskId === "6-4"
        ) {
            if (input.length > 50) {
    return "❌ Ebben a feladatban legfeljebb 50 karakter lehet.";
        }
            const varRegex =
                /\b(let|const)\s+(a|b)\s*=\s*([^;\n]+)/g;
            let match;

            while ((match = varRegex.exec(input)) !== null) {
                const raw = match[3].trim();

                if (!/^-?\d+$/.test(raw)) {
                    return "❌ Ide csak számot lehet írni.";
                }

                const n = parseInt(raw, 10);
                if (n < 0 || n > 99) {
                    return "❌ Ebben a feladatban a számnak 0 és 99 között kell lennie.";
                }
            }
        }

        if (taskId === "3-2") {
    const numberRegex = /-?\d+/g;
    let numMatch;

    while ((numMatch = numberRegex.exec(input)) !== null) {
        const raw = numMatch[0];
        const n = parseInt(raw, 10);

        if (raw.startsWith("-") || n < 0 || n > 99) {
            return "❌ Ebben a feladatban minden számnak 0 és 99 között kell lennie.";
        }
    }
}

if (taskId === "5-1") {
    const numberRegex = /-?\d+/g;
    let numMatch;

    while ((numMatch = numberRegex.exec(input)) !== null) {
        const n = parseInt(numMatch[0], 10);

        if (n < 0 || n > 99) {
            return "❌ Ebben a feladatban minden számnak 0 és 99 között kell lennie.";
        }
    }
}

        return "ok";
    }

    validateSpecialRules(taskId, input, lessonId) {
        if (lessonId === 3) {
            const lesson3Result = this.validateLesson3ExtraRules(input);
            if (lesson3Result !== "ok") {
                return lesson3Result;
            }
        }

        if (taskId === "2-1") {
            return this.validateTask_2_1_Extra(input);
        }

        if (taskId === "4-1") {
            return this.validateTask_4_1_Extra(input);
        }

        if (taskId === "4-2") {
            return this.validateTask_4_2_Extra(input);
        }

        if (taskId === "7-1") {
            return this.validateTask_7_1_Extra(input);
        }

        if (taskId === "8-1") {
            return this.validateTask_8_1_Extra(input);
        }

        return "ok";
    }

    validateLesson3ExtraRules(input) {
        const missingStepForLoop =
            /for\s*\(\s*let\s+\w+\s*=\s*\d+\s*;\s*\w+\s*[<>]=?\s*\d+\s*;\s*\)/;

        if (missingStepForLoop.test(input)) {
            return "❌ A for ciklus harmadik része hibás. Adj meg kilépést is, például: i++";
        }

        const invalidStepForLoop =
            /for\s*\(\s*let\s+\w+\s*=\s*\d+\s*;\s*\w+\s*[<>]=?\s*\d+\s*;\s*\w+[+-]\s*\)/;

        if (invalidStepForLoop.test(input)) {
            return "❌ A for ciklus harmadik része hibás. Adj meg kilépést is, például: i++";
        }

        const noIncrementForLoop =
            /for\s*\(\s*let\s+(\w+)\s*=\s*\d+\s*;\s*\1\s*[<>]=?\s*\d+\s*;\s*\1\s*\)/;

        if (noIncrementForLoop.test(input)) {
            return "❌ A for ciklus harmadik része hibás. Adj meg kilépést is, például: i++";
        }

        const badForLoop =
            /for\s*\(\s*let\s+\w+\s*=\s*(\d+)\s*;\s*\w+\s*<\s*(\d+)/;

        const matchFor = input.match(badForLoop);

        if (matchFor) {
            const start = parseInt(matchFor[1], 10);
            const end = parseInt(matchFor[2], 10);

            if (start >= end) {
                return "❌ A ciklus feltétele hibás: így a ciklus egyszer sem fut le. Ebben a feladatban csak növekvő számsort tudsz kipróbálni, csökkenőt nem.";
            }
        }

        return "ok";
    }

    validateTask_2_1_Extra(input) {
        const nameMatch =
            input.match(/\b(let|const)\s+nev\s*=\s*["'`](.*?)["'`]\s*;/);

        if (!nameMatch) {
            return "ok";
        }

        const nameValue = nameMatch[2].trim();
        const validNamePattern =
            /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+(\d+)?$/;

        if (!validNamePattern.test(nameValue)) {
            return "❌ A név csak betűket tartalmazhat, és a végén opcionálisan egy 0 és 99 közötti számot.";
        }

        const numberMatch = nameValue.match(/(\d+)$/);
        if (numberMatch) {
            const n = parseInt(numberMatch[1], 10);
            if (n < 0 || n > 99) {
                return "❌ A név végén lévő szám csak 0 és 99 közötti lehet.";
            }
        }

        return "ok";
    }

    validateTask_4_1_Extra(input) {
        const textMatch =
            input.match(/console\.log\s*\(\s*["'`](.*?)["'`]\s*\)/s);

        if (!textMatch) {
            return "ok";
        }

        const loggedText = textMatch[1].trim();
        const validTextPattern =
            /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+(\d{1,2})?[.!?]*$/;

        if (!validTextPattern.test(loggedText)) {
            return "❌ A szöveg után csak 0 és 99 közötti számok és mondatvégi írásjelek lehetnek.";
        }

        const numberMatch = loggedText.match(/(\d{1,2})/);
        if (numberMatch) {
            const n = parseInt(numberMatch[1], 10);
            if (n < 0 || n > 99) {
                return "❌ A szöveg utáni szám csak 0 és 99 közötti lehet.";
            }
        }

        return "ok";
    }

    validateTask_4_2_Extra(input) {
        const helloMatch =
            input.match(/hello\s*\(\s*["'`](.*?)["'`]\s*\)/);

        if (!helloMatch) {
            return "ok";
        }

        const nameValue = helloMatch[1].trim();
        const validNamePattern =
            /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+(\d+)?$/;

        if (!validNamePattern.test(nameValue)) {
            return "❌ A név csak betűket tartalmazhat, és a végén opcionálisan egy 0 és 99 közötti számot.";
        }

        const numberMatch = nameValue.match(/(\d+)$/);
        if (numberMatch) {
            const n = parseInt(numberMatch[1], 10);
            if (n < 0 || n > 99) {
                return "❌ A név végén lévő szám csak 0 és 99 közötti lehet.";
            }
        }

        return "ok";
    }

    validateTask_7_1_Extra(input) {
        const textMatch = input.match(
            /document\.getElementById\s*\(\s*["'`]cim["'`]\s*\)\.innerText\s*=\s*["'`](.*?)["'`]/s
        );

        if (!textMatch) {
            return "ok";
        }

        const titleText = textMatch[1].trim();
        const validTitlePattern =
            /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9 ]+[.!?]?$/;

        if (!validTitlePattern.test(titleText)) {
            return "❌ A cím végén csak mondatvégi írásjel lehet (. ! ?), más karakter nem.";
        }

        return "ok";
    }

    validateTask_8_1_Extra(input) {
        const alertMatch =
            input.match(/alert\s*\(\s*["'`](.*?)["'`]\s*\)/s);

        if (!alertMatch) {
            return "ok";
        }

        const alertText = alertMatch[1].trim();
        const validAlertPattern =
            /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű0-9 ]+[.!?]?$/;

        if (!validAlertPattern.test(alertText)) {
            return "❌ Az alert szövegének végén csak mondatvégi írásjel lehet (. ! ?), más karakter nem.";
        }

        return "ok";
    }

    validateTask_2_1(input) {
        const nevOk =
            /\b(let|const)\s+nev\s*=\s*(['"])[^'"]*[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ][^'"]*\2\s*;?/m
                .test(input);

        const korMatch =
            input.match(/\b(let|const)\s+kor\s*=\s*(0|[1-9][0-9]?)\s*;?/m);
        let korOk = false;
        if (korMatch) {
            korOk = !!korMatch;
        }

        const diakOk =
            /\b(let|const)\s+diak\s*=\s*(true|false)\s*;?/m.test(input);

        const logNev = /console\.log\s*\(\s*nev\s*\)/.test(input);
        const logKor = /console\.log\s*\(\s*kor\s*\)/.test(input);
        const logDiak = /console\.log\s*\(\s*diak\s*\)/.test(input);

        return nevOk && korOk && diakOk && logNev && logKor && logDiak;
    }

    validateTask_3_1(input) {
        const korMatch =
            input.match(/\b(let|const)\s+kor\s*=\s*(0|[1-9][0-9]?)\s*;?/m);
        if (!korMatch) {
            return "missingKor";
        }

        const korRaw = korMatch[2];
        const korValue = parseInt(korRaw, 10);

        if (korRaw.startsWith("-") || korValue < 0 || korValue > 99) {
            return "invalidNumber";
        }

        const ifOk = /if\s*\(\s*kor\s*>=\s*18\s*\)/.test(input);
        if (!ifOk) {
            return "missingIf";
        }

        const elseOk = /\belse\b/.test(input);
        if (!elseOk) {
            return "missingElse";
        }

        const logRegex = /console\.log\s*\(\s*(['"])([^'"]*)\1\s*\)/g;
        let foundTexts = [];
        let match;

        while ((match = logRegex.exec(input)) !== null) {
            foundTexts.push(match[2]);
        }

        if (foundTexts.length !== 2) {
            return "invalidText";
        }

        const allowed = ["Nagykorú", "Kiskorú"];

        for (const text of foundTexts) {
            if (!allowed.includes(text)) {
                return "invalidText";
            }
        }

        return "ok";
    }

    validateTask_3_2(input) {
        const match = input.match(
            /for\s*\(\s*let\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)/
        );

        if (!match) {
            return false;
        }

        const start = parseInt(match[1], 10);
        const limit = parseInt(match[2], 10);

        if (
            !Number.isInteger(start) ||
            !Number.isInteger(limit) ||
            start < 0 || start > 99 ||
            limit < 0 || limit > 99
        ) {
            return false;
        }

        return true;
    }

    validateTask_4_1(input) {
        const functionOk = /function\s+koszont\s*\(\s*\)\s*\{/.test(input);

        const logMatch = input.match(
            /console\.log\s*\(\s*(['"])([^'"]*)\1\s*\)/
        );
        if (!logMatch) {
            return false;
        }

        const text = logMatch[2];
        const logOk = /[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]/.test(text);

        const koszontCalls = (input.match(/\bkoszont\s*\(/g) || []).length;
        const callOk = koszontCalls >= 2;

        if (text.length > 50) {
            return false;
        }

        return functionOk && logOk && callOk;
    }

    validateTask_4_2(input) {
        const fnMatch = input.match(
            /function\s+hello\s*\(\s*([a-zA-Z_$][\w$]*)\s*\)\s*\{/
        );
        if (!fnMatch) {
            return false;
        }

        const paramName = fnMatch[1];

        const logOk = /console\.log\s*\(/.test(input);
        if (!logOk) {
            return false;
        }

        const paramUsedInLog = new RegExp(
            `console\\.log\\s*\\([^\\)]*\\b${paramName}\\b[^\\)]*\\)`,
            "m"
        ).test(input);
        if (!paramUsedInLog) {
            return false;
        }

        const helloOccurrences = (input.match(/\bhello\s*\(/g) || []).length;
    const callWithString = /\bhello\s*\(\s*(['"])[^'"]+\1\s*\)/.test(input);
    if (!(helloOccurrences >= 2 && callWithString)) {
        return false;
    }

        const helloCallMatch = input.match(/\bhello\s*\(\s*(['"])([^'"]+)\1\s*\)/);
    if (helloCallMatch) {
        const passedName = helloCallMatch[2].trim();
        if (passedName.length > 50) {
            return false;
        }
    }

        const greetingMatch = input.match(
            /console\.log\s*\(\s*(['"])([^'"]*)\1\s*\+\s*([a-zA-Z_$][\w$]*)\s*\+\s*(['"])([^'"]*)\4\s*\)/
        );

        if (!greetingMatch) {
            return false;
        }

        const beforeName = greetingMatch[2].trim();
        const usedParam = greetingMatch[3];
        const afterName = greetingMatch[5].trim();

        if ((beforeName + afterName).length > 50) {
        return false;
    }

        if (usedParam !== paramName) {
            return false;
        }

        if (!/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+$/.test(beforeName)) {
            return false;
        }

        if (afterName !== "" && !/^[.!?]+$/.test(afterName)) {
            return false;
        }

        return true;
    }

    validateTask_5_1(input) {
    const arrayMatch =
        input.match(/\b(let|const)\s+szamok\s*=\s*\[([^\]]*)\]/);

    if (!arrayMatch) {
        return false;
    }

    const arrayContent = arrayMatch[2].trim();

    if (!arrayContent) {
        return false;
    }

    if (!/\d/.test(arrayContent)) {
        return false;
    }

    if (/^\s*,+\s*$/.test(arrayContent)) {
        return false;
    }

    if (/,\s*,/.test(arrayContent) || /,\s*$/.test(arrayContent)) {
        return false;
    }

    const items = arrayContent
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "");

        if (items.length > 100) {
    return false;
}

    if (items.length < 1) {
        return false;
    }

    for (const item of items) {
        if (!/^\d+$/.test(item)) {
            return false;
        }

        const n = parseInt(item, 10);

        if (n < 0 || n > 99) {
            return false;
        }
    }

    const firstElementOk =
        /console\.log\s*\(\s*szamok\s*\[\s*(0|[1-9][0-9]?)\s*]\s*\)/.test(input);

    const lengthOk =
        /console\.log\s*\(\s*["'`]?Hossz:?["'`]?\s*,\s*szamok\.length\s*\)/
            .test(input) ||
        /console\.log\s*\(\s*szamok\.length\s*\)/.test(input);

    return firstElementOk && lengthOk;
}

    validateTask_6_1(input) {
        const numberPattern = "(0|[1-9]\\d?)";

        const aOk = new RegExp(
            `\\b(let|const)\\s+a\\s*=\\s*${numberPattern}\\s*;?`
        ).test(input);
        const bOk = new RegExp(
            `\\b(let|const)\\s+b\\s*=\\s*${numberPattern}\\s*;?`
        ).test(input);

        const logOk =
            /console\.log\s*\(\s*(a\s*\+\s*b|b\s*\+\s*a)\s*\)/.test(input);

        const minusBad = /(a\s*-\s*b|b\s*-\s*a)/.test(input);
        const multBad = /(a\s*\*\s*b|b\s*\*\s*a)/.test(input);
        const divBad = /(a\s*\/\s*b|b\s*\/\s*a)/.test(input);

        return aOk && bOk && logOk && !minusBad && !multBad && !divBad;
    }

    validateTask_6_2(input) {
        const numberPattern = "(0|[1-9]\\d?)";
        const aOk = new RegExp(
            `\\b(let|const)\\s+a\\s*=\\s*${numberPattern}\\s*;?`
        ).test(input);
        const bOk = new RegExp(
            `\\b(let|const)\\s+b\\s*=\\s*${numberPattern}\\s*;?`
        ).test(input);
        const logOk =
            /console\.log\s*\(\s*(a\s*-\s*b|b\s*-\s*a)\s*\)\s*;?/m.test(input);
        const plusBad = /(a\s*\+\s*b|b\s*\+\s*a)/.test(input);
        const multBad = /(a\s*\*\s*b|b\s*\*\s*a)/.test(input);
        const divBad = /(a\s*\/\s*b|b\s*\/\s*a)/.test(input);

        return aOk && bOk && logOk && !plusBad && !multBad && !divBad;
    }

    validateTask_6_3(input) {
        const numberPattern = "(0|[1-9]\\d?)";
        const aOk = new RegExp(
            `\\b(let|const)\\s+a\\s*=\\s*${numberPattern}\\s*;?`
        ).test(input);
        const bOk = new RegExp(
            `\\b(let|const)\\s+b\\s*=\\s*${numberPattern}\\s*;?`
        ).test(input);
        const logOk =
            /console\.log\s*\(\s*(a\s*\*\s*b|b\s*\*\s*a)\s*\)\s*;?/m.test(input);
        const plusBad = /(a\s*\+\s*b|b\s*\+\s*a)/.test(input);
        const minusBad = /(a\s*-\s*b|b\s*-\s*a)/.test(input);
        const divBad = /(a\s*\/\s*b|b\s*\/\s*a)/.test(input);

        return aOk && bOk && logOk && !plusBad && !minusBad && !divBad;
    }

    validateTask_6_4(input) {
        const numberPattern = "(0|[1-9]\\d?)";
        const aOk = new RegExp(
            `\\b(let|const)\\s+a\\s*=\\s*${numberPattern}\\s*;?`
        ).test(input);
        const bOk = new RegExp(
            `\\b(let|const)\\s+b\\s*=\\s*${numberPattern}\\s*;?`
        ).test(input);
        const logOk =
            /console\.log\s*\(\s*(a\s*\/\s*b|b\s*\/\s*a)\s*\)\s*;?/m.test(input);
        const plusBad = /(a\s*\+\s*b|b\s*\+\s*a)/.test(input);
        const minusBad = /(a\s*-\s*b|b\s*-\s*a)/.test(input);
        const multBad = /(a\s*\*\s*b|b\s*\*\s*a)/.test(input);

        return aOk && bOk && logOk && !plusBad && !minusBad && !multBad;
    }

    validateTask_7_1(input) {
        const getOk =
            /document\.getElementById\s*\(\s*["']cim["']\s*\)/.test(input);

        const textMatch = input.match(/\.innerText\s*=\s*(['"])([^'"]*)\1/);
        if (!textMatch) {
            return false;
        }

        const text = textMatch[2];
        if (text.length > 50) {
            return false;
        }
        if (!/[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]/.test(text)) {
            return false;
        }
        if (/^\d+/.test(text)) {
            return false;
        }

        return getOk;
    }

    validateTask_8_1(input) {
        const getOk =
            /document\.getElementById\s*\(\s*["']gomb["']\s*\)/.test(input);
        const clickOk = /\.onclick\s*=/.test(input);

        const alertMatch =
            input.match(/alert\s*\(\s*(['"])([^'"]*)\1\s*\)/);
        if (!alertMatch) {
            return false;
        }

        const text = alertMatch[2];
        if (text.length > 50) {
            return false;
        }
        if (!/[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]/.test(text)) {
            return false;
        }

        return getOk && clickOk;
    }

    validateTask_9_1(input) {
        const expectedCode =
            'fetch("https://api.example.com").then(res => res.json()).then(data => console.log(data));';

        if (this.normalizeCode(input) !== this.normalizeCode(expectedCode)) {
            return "Írd meg pontosan a fetch → json → console.log láncot.";
        }

        return "ok";
    }

    getSolution(taskId) {
        if (!window.TASK_SOLUTIONS) {
            return null;
        }
        return window.TASK_SOLUTIONS[taskId] || null;
    }

    analyzeCode(input, expected) {
        const errors = [];

        const pairs = [
            ["(", ")"],
            ["{", "}"],
            ["[", "]"]
        ];

        pairs.forEach(([open, close]) => {
            const openCount =
                (input.match(new RegExp(`\\${open}`, "g")) || []).length;
            const closeCount =
                (input.match(new RegExp(`\\${close}`, "g")) || []).length;
            if (openCount !== closeCount) {
                errors.push(
                    `Hiányzó vagy felesleges <code>${open}</code> / <code>${close}</code> zárójel`
                );
            }
        });

        const doubleQuotes = (input.match(/"/g) || []).length;
        if (doubleQuotes % 2 !== 0) {
            errors.push('Hiányzó vagy rossz <code>"</code> idézőjel');
        }

        const singleQuotes = (input.match(/'/g) || []).length;
        if (singleQuotes % 2 !== 0) {
            errors.push("Hiányzó vagy rossz <code>'</code> idézőjel");
        }

        if (expected.includes(";")) {
            const inputSemi = (input.match(/;/g) || []).length;
            const expectedSemi = (expected.match(/;/g) || []).length;
            if (inputSemi < expectedSemi) {
                errors.push("Hiányzó <code>;</code> (pontosvessző)");
            }
        }

        ["if", "else", "for", "function", "return", "let", "const"]
            .forEach(keyword => {
                if (expected.includes(keyword) && !input.includes(keyword)) {
                    errors.push(
                        `Hiányzik a <code>${keyword}</code> kulcsszó`
                    );
                }
            });

        const callRegex = /\b[a-zA-Z_$][\w$]*\s*\(/g;
        const expectedCalls = expected.match(callRegex) || [];
        const inputCalls = input.match(callRegex) || [];

        expectedCalls.forEach(call => {
            const name = call.replace(/\s*\($/, "");
            if (!inputCalls.some(c => c.includes(name))) {
                errors.push(`Hiányzik a <code>${name}()</code> függvényhívás`);
            }
        });

        const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        const expectedStrings = expected.match(stringRegex) || [];

        expectedStrings.forEach(str => {
            if (!input.includes(str)) {
                errors.push(`Hiányzik a szöveg: <code>${str}</code>`);
            }
        });

        return errors;
    }
}

window.LessonTaskValidators = LessonTaskValidators;