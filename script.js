document.addEventListener("DOMContentLoaded", () => {
    // === NAVIGATION ENTRE ÉTAPES ===
    const menuItems = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".etape");
  
    function showSection(id) {
      sections.forEach(section => {
        section.classList.remove("active");
        if (section.id === id) {
          section.classList.add("active");
        }
      });
  
      menuItems.forEach(item => {
        item.classList.remove("active");
        if (item.dataset.target === id) {
          item.classList.add("active");
        }
      });
    }
  
    menuItems.forEach(item => {
      item.addEventListener("click", () => {
        const targetId = item.dataset.target;
        showSection(targetId);
      });
    });
  
    // === TRACÉ LETTRE - NAVIGATION D'ÉTAPES ===
    const lettreData = {
      lettre: "ا",
      transcription: "ʾā",
      images: ["alif1.png", "alif2.png"]
    };
  
    let indexEtape = 0;
  
    function majAffichageEcriture() {
      const imgPath = "img/ecriture/" + lettreData.images[indexEtape];
      const img = document.getElementById("image-ecriture");
      const lettre = document.getElementById("lettre-courante");
      const transcription = document.getElementById("transcription-courante");
      const etapeNum = document.getElementById("etape-num");
      const etapeTotal = document.getElementById("etape-total");
  
      if (img) img.src = imgPath;
      if (lettre) lettre.textContent = lettreData.lettre;
      if (transcription) transcription.textContent = lettreData.transcription;
      if (etapeNum) etapeNum.textContent = indexEtape + 1;
      if (etapeTotal) etapeTotal.textContent = lettreData.images.length;
    }
  
    const btnNext = document.getElementById("btn-next");
    const btnPrev = document.getElementById("btn-prev");
  
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        indexEtape = (indexEtape + 1) % lettreData.images.length;
        majAffichageEcriture();
      });
    }
  
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        indexEtape = (indexEtape - 1 + lettreData.images.length) % lettreData.images.length;
        majAffichageEcriture();
      });
    }
  
    // === CANVAS DESSIN ===
    const canvas = document.getElementById("canvas-ecriture");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      let dessin = false;
  
      function getXY(e, isTouch = false) {
        const rect = canvas.getBoundingClientRect();
        const x = isTouch ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = isTouch ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
        return { x, y };
      }
  
      function dessiner(e) {
        if (!dessin) return;
        const { x, y } = getXY(e, e.type.includes("touch"));
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineTo(x, y);
        ctx.stroke();
      }
  
      canvas.addEventListener("mousedown", () => dessin = true);
      canvas.addEventListener("mouseup", () => dessin = false);
      canvas.addEventListener("mouseleave", () => dessin = false);
      canvas.addEventListener("mousemove", dessiner);
  
      canvas.addEventListener("touchstart", () => dessin = true);
      canvas.addEventListener("touchend", () => dessin = false);
      canvas.addEventListener("touchcancel", () => dessin = false);
      canvas.addEventListener("touchmove", dessiner);
  
      const btnEffacer = document.getElementById("effacer-canvas");
      if (btnEffacer) {
        btnEffacer.addEventListener("click", () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
      }
    }
  
    // Initialiser affichage étape 3 si elle est visible
    if (document.getElementById("etape3")) {
      majAffichageEcriture();
    }
  
    // Initialiser section par défaut
    showSection("etape1");
  });
  const lettresQuiz = [
    { lettre: "ا", transcription: "ʾā" },
    { lettre: "ب", transcription: "b" },
    { lettre: "ت", transcription: "t" },
    { lettre: "ث", transcription: "th" },
    { lettre: "ج", transcription: "j" },
    { lettre: "ح", transcription: "ḥ" },
    { lettre: "خ", transcription: "kh" },
    { lettre: "د", transcription: "d" },
    { lettre: "ذ", transcription: "dh" },
    { lettre: "ر", transcription: "r" },
    { lettre: "ز", transcription: "z" },
    { lettre: "س", transcription: "s" },
    { lettre: "ش", transcription: "sh" },
    { lettre: "ص", transcription: "ṣ" },
    { lettre: "ض", transcription: "ḍ" },
    { lettre: "ط", transcription: "ṭ" },
    { lettre: "ظ", transcription: "ẓ" },
    { lettre: "ع", transcription: "3a" },
    { lettre: "غ", transcription: "gh" },
    { lettre: "ف", transcription: "f" },
    { lettre: "ق", transcription: "q" },
    { lettre: "ك", transcription: "k" },
    { lettre: "ل", transcription: "l" },
    { lettre: "م", transcription: "m" },
    { lettre: "ن", transcription: "n" },
    { lettre: "ه", transcription: "h" },
    { lettre: "و", transcription: "w" },
    { lettre: "ي", transcription: "y" }
  ];
  
  let score = 0;
  
  function newQuizQuestion() {
    const quiz = document.getElementById("quiz-container");
    if (!quiz) return;
  
    const lettreObj = lettresQuiz[Math.floor(Math.random() * lettresQuiz.length)];
    const bonne = lettreObj.transcription;
    const mauvaises = lettresQuiz.filter(l => l.transcription !== bonne);
    const propositions = [bonne, ...mauvaises.slice(0, 2).map(m => m.transcription)].sort(() => 0.5 - Math.random());
  
    document.getElementById("quiz-lettre").textContent = lettreObj.lettre;
    const options = document.getElementById("quiz-options");
    const feedback = document.getElementById("quiz-feedback");
    options.innerHTML = "";
    feedback.textContent = "";
  
    propositions.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.onclick = () => {
        if (option === bonne) {
          feedback.textContent = "✅ Bonne réponse !";
          feedback.style.color = "green";
          score++;
        } else {
          feedback.textContent = `❌ Faux ! Réponse : ${bonne}`;
          feedback.style.color = "red";
        }
        document.getElementById("quiz-score").textContent = "Score : " + score;
        setTimeout(newQuizQuestion, 1000);
      };
      options.appendChild(btn);
    });
  }
  
  const restart = document.getElementById("btn-restart");
  if (restart) {
    restart.addEventListener("click", () => {
      score = 0;
      document.getElementById("quiz-score").textContent = "Score : 0";
      newQuizQuestion();
    });
  }
  
  if (document.getElementById("quiz-container")) {
    newQuizQuestion();
  }
  const lettresFormes = [
    { lettre: "ب", transcription: "b", formes: { isolée: "ب", début: "بـ", milieu: "ـبـ", fin: "ـب" } },
    { lettre: "ت", transcription: "t", formes: { isolée: "ت", début: "تـ", milieu: "ـتـ", fin: "ـت" } },
    { lettre: "ث", transcription: "th", formes: { isolée: "ث", début: "ثـ", milieu: "ـثـ", fin: "ـث" } },
    { lettre: "س", transcription: "s", formes: { isolée: "س", début: "سـ", milieu: "ـسـ", fin: "ـس" } },
    { lettre: "ن", transcription: "n", formes: { isolée: "ن", début: "نـ", milieu: "ـنـ", fin: "ـن" } },
    { lettre: "م", transcription: "m", formes: { isolée: "م", début: "مـ", milieu: "ـمـ", fin: "ـم" } },
    { lettre: "ك", transcription: "k", formes: { isolée: "ك", début: "كـ", milieu: "ـكـ", fin: "ـك" } },
    { lettre: "ي", transcription: "y", formes: { isolée: "ي", début: "يـ", milieu: "ـيـ", fin: "ـي" } },
  ];
  
  let scoreForme = 0;
  let verrouille = false;
  
  function newFormeQuestion() {
    if (verrouille) return;
  
    const questionZone = document.getElementById("quiz-question-forme");
    const optionsZone = document.getElementById("quiz-options-forme");
    const feedbackZone = document.getElementById("quiz-feedback-forme");
    const scoreZone = document.getElementById("quiz-score-forme");
  
    const item = lettresFormes[Math.floor(Math.random() * lettresFormes.length)];
    const positions = ["isolée", "début", "milieu", "fin"];
    const bonnePosition = positions[Math.floor(Math.random() * positions.length)];
    const bonneReponse = item.formes[bonnePosition];
  
    questionZone.innerHTML = `Quelle est la forme de la lettre <strong>${item.lettre}</strong> (${item.transcription}) en <strong>${bonnePosition}</strong> de mot ?`;
    feedbackZone.textContent = "";
    optionsZone.innerHTML = "";
    verrouille = false;
  
    const toutesFormes = Object.values(item.formes).sort(() => Math.random() - 0.5);
  
    toutesFormes.forEach(forme => {
      const btn = document.createElement("button");
      btn.textContent = forme;
      btn.onclick = () => {
        if (verrouille) return;
        verrouille = true;
        if (forme === bonneReponse) {
          feedbackZone.textContent = "✅ Bonne réponse !";
          feedbackZone.style.color = "green";
          scoreForme++;
        } else {
          feedbackZone.textContent = `❌ Mauvais choix. Bonne réponse : ${bonneReponse}`;
          feedbackZone.style.color = "red";
        }
        scoreZone.textContent = "Score : " + scoreForme;
  
        setTimeout(() => {
          verrouille = false;
          newFormeQuestion();
        }, 4000); // délai augmenté à 4 secondes
      };
      optionsZone.appendChild(btn);
    });
  }
  
  const restartForme = document.getElementById("quiz-restart-forme");
  if (restartForme) {
    restartForme.addEventListener("click", () => {
      scoreForme = 0;
      document.getElementById("quiz-score-forme").textContent = "Score : 0";
      newFormeQuestion();
    });
  }
  
  if (document.getElementById("quiz-formes")) {
    newFormeQuestion();
  }
  const lettresNoms = [
    { lettre: "ا", nom: "Alif" },
    { lettre: "ب", nom: "Ba" },
    { lettre: "ت", nom: "Ta" },
    { lettre: "ث", nom: "Tha" },
    { lettre: "ج", nom: "Jiim" },
    { lettre: "ح", nom: "Hha" },
    { lettre: "خ", nom: "Kha" },
    { lettre: "د", nom: "Daal" },
    { lettre: "ذ", nom: "Dhal" },
    { lettre: "ر", nom: "Ra" },
    { lettre: "ز", nom: "Zay" },
    { lettre: "س", nom: "Sin" },
    { lettre: "ش", nom: "Shiin" },
    { lettre: "ص", nom: "Saad" },
    { lettre: "ض", nom: "Daad" },
    { lettre: "ط", nom: "Taa" },
    { lettre: "ظ", nom: "Thaa" },
    { lettre: "ع", nom: "Ayn" },
    { lettre: "غ", nom: "Ghayn" },
    { lettre: "ف", nom: "Fa" },
    { lettre: "ق", nom: "Qaf" },
    { lettre: "ك", nom: "Kaf" },
    { lettre: "ل", nom: "Lam" },
    { lettre: "م", nom: "Miim" },
    { lettre: "ن", nom: "Nuun" },
    { lettre: "ه", nom: "Ha" },
    { lettre: "و", nom: "Waw" },
    { lettre: "ي", nom: "Ya" },
  ];
  
  let scoreLettreNom = 0;
  
  function nouvelleQuestionLettreNom() {
    const question = document.getElementById("question-lettre-nom");
    const reponses = document.getElementById("reponses-lettres-noms");
    const feedback = document.getElementById("feedback-lettres-noms");
    const score = document.getElementById("score-lettres-noms");
  
    const questionData = lettresNoms[Math.floor(Math.random() * lettresNoms.length)];
    const bonne = questionData.nom;
  
    const mauvaises = lettresNoms
      .filter(l => l.nom !== bonne)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map(l => l.nom);
  
    const options = [bonne, ...mauvaises].sort(() => 0.5 - Math.random());
  
    question.textContent = questionData.lettre;
    reponses.innerHTML = "";
    feedback.textContent = "";
  
    options.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.onclick = () => {
        // 🔊 Joue le son de la lettre affichée (répertoire audio/lettres/)
        const nomFichier = lettresNoms.find(l => l.nom === bonne)?.nom.toLowerCase();
        if (nomFichier) {
          const audio = new Audio(`audio/lettres/${nomFichier}.mp3`);
          audio.play();
        }
      
        if (option === bonne) {
          feedback.textContent = "✅ Bonne réponse !";
          feedback.style.color = "green";
          scoreLettreNom++;
        } else {
          feedback.textContent = `❌ Faux. C'était : ${bonne}`;
          feedback.style.color = "red";
        }
        score.textContent = "Score : " + scoreLettreNom;
        setTimeout(nouvelleQuestionLettreNom, 3000);
      };
      
      reponses.appendChild(btn);
    });
  }
  
  const restartNomBtn = document.getElementById("restart-lettres-noms");
  if (restartNomBtn) {
    restartNomBtn.addEventListener("click", () => {
      scoreLettreNom = 0;
      document.getElementById("score-lettres-noms").textContent = "Score : 0";
      nouvelleQuestionLettreNom();
    });
  }
  
  if (document.getElementById("quiz-lettres-noms")) {
    nouvelleQuestionLettreNom();
  }
  const harakatQuizData = [
    // Lettres + Fatha
    { mot: "بَ", bonneReponse: "ba" }, { mot: "تَ", bonneReponse: "ta" }, { mot: "ثَ", bonneReponse: "tha" },
    { mot: "جَ", bonneReponse: "ja" }, { mot: "حَ", bonneReponse: "ḥa" }, { mot: "خَ", bonneReponse: "kha" },
    { mot: "دَ", bonneReponse: "da" }, { mot: "ذَ", bonneReponse: "dha" }, { mot: "رَ", bonneReponse: "ra" },
    { mot: "زَ", bonneReponse: "za" }, { mot: "سَ", bonneReponse: "sa" }, { mot: "شَ", bonneReponse: "sha" },
    { mot: "صَ", bonneReponse: "ṣa" }, { mot: "ضَ", bonneReponse: "ḍa" }, { mot: "طَ", bonneReponse: "ṭa" },
    { mot: "ظَ", bonneReponse: "ẓa" }, { mot: "عَ", bonneReponse: "ʿa" }, { mot: "غَ", bonneReponse: "gha" },
    { mot: "فَ", bonneReponse: "fa" }, { mot: "قَ", bonneReponse: "qa" }, { mot: "كَ", bonneReponse: "ka" },
    { mot: "لَ", bonneReponse: "la" }, { mot: "مَ", bonneReponse: "ma" }, { mot: "نَ", bonneReponse: "na" },
    { mot: "هَ", bonneReponse: "ha" }, { mot: "وَ", bonneReponse: "wa" }, { mot: "يَ", bonneReponse: "ya" },
  
    // Lettres + Kasra
    { mot: "بِ", bonneReponse: "bi" }, { mot: "تِ", bonneReponse: "ti" }, { mot: "ثِ", bonneReponse: "thi" },
    { mot: "جِ", bonneReponse: "ji" }, { mot: "حِ", bonneReponse: "ḥi" }, { mot: "خِ", bonneReponse: "khi" },
    { mot: "دِ", bonneReponse: "di" }, { mot: "ذِ", bonneReponse: "dhi" }, { mot: "رِ", bonneReponse: "ri" },
    { mot: "زِ", bonneReponse: "zi" }, { mot: "سِ", bonneReponse: "si" }, { mot: "شِ", bonneReponse: "shi" },
    { mot: "صِ", bonneReponse: "ṣi" }, { mot: "ضِ", bonneReponse: "ḍi" }, { mot: "طِ", bonneReponse: "ṭi" },
    { mot: "ظِ", bonneReponse: "ẓi" }, { mot: "عِ", bonneReponse: "ʿi" }, { mot: "غِ", bonneReponse: "ghi" },
    { mot: "فِ", bonneReponse: "fi" }, { mot: "قِ", bonneReponse: "qi" }, { mot: "كِ", bonneReponse: "ki" },
    { mot: "لِ", bonneReponse: "li" }, { mot: "مِ", bonneReponse: "mi" }, { mot: "نِ", bonneReponse: "ni" },
    { mot: "هِ", bonneReponse: "hi" }, { mot: "وِ", bonneReponse: "wi" }, { mot: "يِ", bonneReponse: "yi" },
  
    // Lettres + Damma
    { mot: "بُ", bonneReponse: "bou" }, { mot: "تُ", bonneReponse: "tou" }, { mot: "ثُ", bonneReponse: "thou" },
    { mot: "جُ", bonneReponse: "jou" }, { mot: "حُ", bonneReponse: "ḥou" }, { mot: "خُ", bonneReponse: "khou" },
    { mot: "دُ", bonneReponse: "dou" }, { mot: "ذُ", bonneReponse: "dhou" }, { mot: "رُ", bonneReponse: "rou" },
    { mot: "زُ", bonneReponse: "zou" }, { mot: "سُ", bonneReponse: "sou" }, { mot: "شُ", bonneReponse: "shou" },
    { mot: "صُ", bonneReponse: "ṣou" }, { mot: "ضُ", bonneReponse: "ḍou" }, { mot: "طُ", bonneReponse: "ṭou" },
    { mot: "ظُ", bonneReponse: "ẓou" }, { mot: "عُ", bonneReponse: "ʿou" }, { mot: "غُ", bonneReponse: "ghou" },
    { mot: "فُ", bonneReponse: "fou" }, { mot: "قُ", bonneReponse: "qou" }, { mot: "كُ", bonneReponse: "kou" },
    { mot: "لُ", bonneReponse: "lou" }, { mot: "مُ", bonneReponse: "mou" }, { mot: "نُ", bonneReponse: "nou" },
    { mot: "هُ", bonneReponse: "hou" }, { mot: "وُ", bonneReponse: "wou" }, { mot: "يُ", bonneReponse: "you" }
  ];
  
  let scoreHarakat = 0;
  
  function nouvelleQuestionHarakat() {
    const item = harakatQuizData[Math.floor(Math.random() * harakatQuizData.length)];
    const bonne = item.bonneReponse;
    const consonne = bonne.slice(0, bonne.length - (bonne.endsWith("ou") ? 2 : 1));
  
    const autres = ["a", "i", "ou"].filter(v => {
      return !bonne.includes(v);
    });
  
    const mauvaises = autres.map(v => consonne + (v === "ou" ? "ou" : v));
    const options = [bonne, ...mauvaises].sort(() => 0.5 - Math.random());
  
    document.getElementById("harakat-question").textContent = item.mot;
    const optionsZone = document.getElementById("harakat-options");
    const feedback = document.getElementById("harakat-feedback");
  
    optionsZone.innerHTML = "";
    feedback.textContent = "";
  
    options.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.onclick = () => {
        if (option === bonne) {
          feedback.textContent = "✅ Bonne réponse !";
          feedback.style.color = "green";
          scoreHarakat++;
        } else {
          feedback.textContent = `❌ Faux. Réponse correcte : ${bonne}`;
          feedback.style.color = "red";
        }
        document.getElementById("harakat-score").textContent = "Score : " + scoreHarakat;
        setTimeout(nouvelleQuestionHarakat, 3500);
      };
      optionsZone.appendChild(btn);
    });
  }
  
  const btnRestartHarakat = document.getElementById("harakat-restart");
  if (btnRestartHarakat) {
    btnRestartHarakat.addEventListener("click", () => {
      scoreHarakat = 0;
      document.getElementById("harakat-score").textContent = "Score : 0";
      nouvelleQuestionHarakat();
    });
  }
  
  if (document.getElementById("quiz-harakat")) {
    nouvelleQuestionHarakat();
  }
  const tanwinQuizData = [
    { mot: "بً", bonneReponse: "ban" }, { mot: "بٍ", bonneReponse: "bin" }, { mot: "بٌ", bonneReponse: "boun" },
    { mot: "تً", bonneReponse: "tan" }, { mot: "تٍ", bonneReponse: "tin" }, { mot: "تٌ", bonneReponse: "toun" },
    { mot: "ثً", bonneReponse: "than" }, { mot: "ثٍ", bonneReponse: "thin" }, { mot: "ثٌ", bonneReponse: "thoun" },
    { mot: "جً", bonneReponse: "jan" }, { mot: "جٍ", bonneReponse: "jin" }, { mot: "جٌ", bonneReponse: "joun" },
    { mot: "حً", bonneReponse: "ḥan" }, { mot: "حٍ", bonneReponse: "ḥin" }, { mot: "حٌ", bonneReponse: "ḥoun" },
    { mot: "خً", bonneReponse: "khan" }, { mot: "خٍ", bonneReponse: "khin" }, { mot: "خٌ", bonneReponse: "khoun" },
    { mot: "دً", bonneReponse: "dan" }, { mot: "دٍ", bonneReponse: "din" }, { mot: "دٌ", bonneReponse: "doun" },
    { mot: "ذً", bonneReponse: "dhan" }, { mot: "ذٍ", bonneReponse: "dhin" }, { mot: "ذٌ", bonneReponse: "dhoun" },
    { mot: "رً", bonneReponse: "ran" }, { mot: "رٍ", bonneReponse: "rin" }, { mot: "رٌ", bonneReponse: "roun" },
    { mot: "زً", bonneReponse: "zan" }, { mot: "زٍ", bonneReponse: "zin" }, { mot: "زٌ", bonneReponse: "zoun" },
    { mot: "سً", bonneReponse: "san" }, { mot: "سٍ", bonneReponse: "sin" }, { mot: "سٌ", bonneReponse: "soun" },
    { mot: "شً", bonneReponse: "shan" }, { mot: "شٍ", bonneReponse: "shin" }, { mot: "شٌ", bonneReponse: "shoun" },
    { mot: "صً", bonneReponse: "ṣan" }, { mot: "صٍ", bonneReponse: "ṣin" }, { mot: "صٌ", bonneReponse: "ṣoun" },
    { mot: "ضً", bonneReponse: "ḍan" }, { mot: "ضٍ", bonneReponse: "ḍin" }, { mot: "ضٌ", bonneReponse: "ḍoun" },
    { mot: "طً", bonneReponse: "ṭan" }, { mot: "طٍ", bonneReponse: "ṭin" }, { mot: "طٌ", bonneReponse: "ṭoun" },
    { mot: "ظً", bonneReponse: "ẓan" }, { mot: "ظٍ", bonneReponse: "ẓin" }, { mot: "ظٌ", bonneReponse: "ẓoun" },
    { mot: "عً", bonneReponse: "ʿan" }, { mot: "عٍ", bonneReponse: "ʿin" }, { mot: "عٌ", bonneReponse: "ʿoun" },
    { mot: "غً", bonneReponse: "ghan" }, { mot: "غٍ", bonneReponse: "ghin" }, { mot: "غٌ", bonneReponse: "ghoun" },
    { mot: "فً", bonneReponse: "fan" }, { mot: "فٍ", bonneReponse: "fin" }, { mot: "فٌ", bonneReponse: "foun" },
    { mot: "قً", bonneReponse: "qan" }, { mot: "قٍ", bonneReponse: "qin" }, { mot: "قٌ", bonneReponse: "qoun" },
    { mot: "كً", bonneReponse: "kan" }, { mot: "كٍ", bonneReponse: "kin" }, { mot: "كٌ", bonneReponse: "koun" },
    { mot: "لً", bonneReponse: "lan" }, { mot: "لٍ", bonneReponse: "lin" }, { mot: "لٌ", bonneReponse: "loun" },
    { mot: "مً", bonneReponse: "man" }, { mot: "مٍ", bonneReponse: "min" }, { mot: "مٌ", bonneReponse: "moun" },
    { mot: "نً", bonneReponse: "nan" }, { mot: "نٍ", bonneReponse: "nin" }, { mot: "نٌ", bonneReponse: "noun" },
    { mot: "هً", bonneReponse: "han" }, { mot: "هِ", bonneReponse: "hin" }, { mot: "هٌ", bonneReponse: "houn" },
    { mot: "وً", bonneReponse: "wan" }, { mot: "وٍ", bonneReponse: "win" }, { mot: "وٌ", bonneReponse: "woun" },
    { mot: "يً", bonneReponse: "yan" }, { mot: "يٍ", bonneReponse: "yin" }, { mot: "يٌ", bonneReponse: "youn" }
  ];
  
  let scoreTanwin = 0;
  
  function nouvelleQuestionTanwin() {
    const item = tanwinQuizData[Math.floor(Math.random() * tanwinQuizData.length)];
    const bonne = item.bonneReponse;
    const consonne = bonne.slice(0, bonne.length - (bonne.endsWith("oun") ? 3 : 2));
  
    const autres = ["an", "in", "oun"].filter(v => !bonne.endsWith(v));
    const mauvaises = autres.map(v => consonne + v);
    const options = [bonne, ...mauvaises].sort(() => 0.5 - Math.random());
  
    document.getElementById("tanwin-question").textContent = item.mot;
    const optionsZone = document.getElementById("tanwin-options");
    const feedback = document.getElementById("tanwin-feedback");
  
    optionsZone.innerHTML = "";
    feedback.textContent = "";
  
    options.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.onclick = () => {
        if (option === bonne) {
          feedback.textContent = "✅ Bonne réponse !";
          feedback.style.color = "green";
          scoreTanwin++;
        } else {
          feedback.textContent = `❌ Mauvais choix. Réponse correcte : ${bonne}`;
          feedback.style.color = "red";
        }
        document.getElementById("tanwin-score").textContent = "Score : " + scoreTanwin;
        setTimeout(nouvelleQuestionTanwin, 3500);
      };
      optionsZone.appendChild(btn);
    });
  }
  
  const btnRestartTanwin = document.getElementById("tanwin-restart");
  if (btnRestartTanwin) {
    btnRestartTanwin.addEventListener("click", () => {
      scoreTanwin = 0;
      document.getElementById("tanwin-score").textContent = "Score : 0";
      nouvelleQuestionTanwin();
    });
  }
  
  if (document.getElementById("quiz-tanwin")) {
    nouvelleQuestionTanwin();
  }
  const lettresNonLiantes = ["أ", "د", "ذ", "ر", "ز", "و"];
  const lettresLiantes = ["ب", "ت", "س", "م", "ق", "ف", "ن", "ل", "ي", "ش"];
  const quizLettresMix = [...lettresNonLiantes.map(l => ({ lettre: l, reponse: "non" })), 
                          ...lettresLiantes.map(l => ({ lettre: l, reponse: "oui" }))];
  
  let scoreNonLiante = 0;
  
  function nouvelleQuestionNonLiante() {
    const item = quizLettresMix[Math.floor(Math.random() * quizLettresMix.length)];
    const bonne = item.reponse;
    const lettre = item.lettre;
  
    document.getElementById("question-non-liante").textContent = lettre;
    const feedback = document.getElementById("feedback-non-liante");
    feedback.textContent = "";
  
    document.querySelectorAll("#reponses-non-liante button").forEach(btn => {
      btn.onclick = () => {
        const choix = btn.getAttribute("data-reponse");
        if (choix === bonne) {
          feedback.textContent = "✅ Bonne réponse !";
          feedback.style.color = "green";
          scoreNonLiante++;
        } else {
          feedback.textContent = `❌ Faux. La bonne réponse était : ${bonne === "oui" ? "Oui" : "Non"}`;
          feedback.style.color = "red";
        }
        document.getElementById("score-non-liante").textContent = "Score : " + scoreNonLiante;
        setTimeout(nouvelleQuestionNonLiante, 3000);
      };
    });
  }
  
  const btnRestartNL = document.getElementById("restart-non-liante");
  if (btnRestartNL) {
    btnRestartNL.addEventListener("click", () => {
      scoreNonLiante = 0;
      document.getElementById("score-non-liante").textContent = "Score : 0";
      nouvelleQuestionNonLiante();
    });
  }
  
  if (document.getElementById("quiz-non-liantes")) {
    nouvelleQuestionNonLiante();
  }
  const motsQuiz = [
    { arabe: "بَيْتٌ", transcription: "baytoun", traduction: "maison" },
    { arabe: "بَابٌ", transcription: "bāboun", traduction: "porte" },
    { arabe: "نُورٌ", transcription: "nouroun", traduction: "lumière" },
    { arabe: "قَلْبٌ", transcription: "qalboun", traduction: "cœur" },
    { arabe: "قَلَمٌ", transcription: "qalamoun", traduction: "stylo" },
    { arabe: "عَيْنٌ", transcription: "ʿaynoun", traduction: "œil" },
    { arabe: "يَدٌ", transcription: "yadoun", traduction: "main" },
    { arabe: "رَجُلٌ", transcription: "rajouloun", traduction: "homme" },
    { arabe: "أَمْرٌ", transcription: "amroun", traduction: "ordre" },
    { arabe: "كَلْبٌ", transcription: "kalboun", traduction: "chien" },
    { arabe: "قِطٌّ", transcription: "qiṭṭoun", traduction: "chat" },
    { arabe: "شَمْسٌ", transcription: "shamsoun", traduction: "soleil" },
    { arabe: "قَمَرٌ", transcription: "qamaroun", traduction: "lune" },
    { arabe: "مَاءٌ", transcription: "māʾoun", traduction: "eau" },
    { arabe: "نَارٌ", transcription: "nāroun", traduction: "feu" },
    { arabe: "وَقْتٌ", transcription: "waqtoun", traduction: "temps" },
    { arabe: "أَرْضٌ", transcription: "arḍoun", traduction: "terre" },
    { arabe: "سَمَاءٌ", transcription: "samāʾoun", traduction: "ciel" },
    { arabe: "وَلَدٌ", transcription: "waladoun", traduction: "garçon" },
    { arabe: "بِنْتٌ", transcription: "bintoun", traduction: "fille" }
  ];
  
  let scoreMots = 0;
  let quizActif = true;
  
  function nouvelleQuestionMotsArabes() {
    quizActif = true;
    document.getElementById("btn-suivant-mots")?.remove(); // Supprime le bouton précédent s'il existe
    const item = motsQuiz[Math.floor(Math.random() * motsQuiz.length)];
    const bonne = item.arabe;
    const transcription = item.transcription;
  
    let faux;
    do {
      faux = motsQuiz[Math.floor(Math.random() * motsQuiz.length)];
    } while (faux.arabe === bonne);
  
    const options = [item, faux].sort(() => 0.5 - Math.random());
  
    document.getElementById("mot-transcription").textContent = transcription;
    const zone = document.getElementById("mots-propositions");
    const feedback = document.getElementById("feedback-mots-arabes");
  
    zone.innerHTML = "";
    feedback.innerHTML = "";
  
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt.arabe;
      btn.onclick = () => {
        if (!quizActif) return;
        quizActif = false;
  
        if (opt.arabe === bonne) {
          feedback.innerHTML = `<p style='color:green;'>✅ Bonne réponse !</p>`;
          scoreMots++;
        } else {
          feedback.innerHTML = `<p style='color:red;'>❌ Mauvais choix.</p>`;
        }
  
        // Détails colorés des réponses
        options.forEach(opt2 => {
          const color = opt2.arabe === bonne ? "green" : "red";
          feedback.innerHTML += `
            <p style="color:${color}; font-size:18px;">
              ${opt2.arabe} → ${opt2.transcription} = ${opt2.traduction}
            </p>`;
        });
  
        document.getElementById("score-mots-arabes").textContent = "Score : " + scoreMots;
  
        // Bouton pour passer à la suite
        const nextBtn = document.createElement("button");
        nextBtn.id = "btn-suivant-mots";
        nextBtn.textContent = "👉 Question suivante";
        nextBtn.style.marginTop = "15px";
        nextBtn.style.padding = "10px 20px";
        nextBtn.style.fontSize = "16px";
        nextBtn.style.borderRadius = "8px";
        nextBtn.style.cursor = "pointer";
        nextBtn.onclick = () => nouvelleQuestionMotsArabes();
  
        feedback.appendChild(nextBtn);
      };
      zone.appendChild(btn);
    });
  }
  
  const restartMots = document.getElementById("restart-mots-arabes");
  if (restartMots) {
    restartMots.addEventListener("click", () => {
      scoreMots = 0;
      document.getElementById("score-mots-arabes").textContent = "Score : 0";
      nouvelleQuestionMotsArabes();
    });
  }
  
  if (document.getElementById("quiz-mots-arabes")) {
    nouvelleQuestionMotsArabes();
  }
  document.querySelectorAll('.btn-audio').forEach(btn => {
    btn.addEventListener('click', () => {
      const fichier = btn.getAttribute('data-son');
      const dossier = btn.getAttribute('data-dir') || "lettres";
      const audio = new Audio(`audio/${dossier}/${fichier}`);
      audio.play();
    });
  });
  const quizLettres = [
    { lettre: "ا", transcription: "ʾā", audio: "alif.mp3" },
    { lettre: "ب", transcription: "b", audio: "ba.mp3" },
    { lettre: "ت", transcription: "t", audio: "ta.mp3" },
    { lettre: "ث", transcription: "th", audio: "tha.mp3" },
    { lettre: "ج", transcription: "j", audio: "jiim.mp3" },
    { lettre: "ح", transcription: "ḥ", audio: "hha.mp3" },
    { lettre: "خ", transcription: "kh", audio: "kha.mp3" },
    { lettre: "د", transcription: "d", audio: "daal.mp3" },
    { lettre: "ذ", transcription: "dh", audio: "thaal.mp3" },
    { lettre: "ر", transcription: "r", audio: "ra.mp3" },
    { lettre: "ز", transcription: "z", audio: "zay.mp3" },
    { lettre: "س", transcription: "s", audio: "siin.mp3" },
    { lettre: "ش", transcription: "sh", audio: "shiin.mp3" },
    { lettre: "ص", transcription: "ṣ", audio: "saad.mp3" },
    { lettre: "ض", transcription: "ḍ", audio: "daad.mp3" },
    { lettre: "ط", transcription: "ṭ", audio: "taa.mp3" },
    { lettre: "ظ", transcription: "ẓ", audio: "thaa.mp3" },
    { lettre: "ع", transcription: "ʿ", audio: "ayn.mp3" },
    { lettre: "غ", transcription: "gh", audio: "ghayn.mp3" },
    { lettre: "ف", transcription: "f", audio: "fa.mp3" },
    { lettre: "ق", transcription: "q", audio: "qaf.mp3" },
    { lettre: "ك", transcription: "k", audio: "kaf.mp3" },
    { lettre: "ل", transcription: "l", audio: "lam.mp3" },
    { lettre: "م", transcription: "m", audio: "miim.mp3" },
    { lettre: "ن", transcription: "n", audio: "nuun.mp3" },
    { lettre: "ه", transcription: "h", audio: "ha.mp3" },
    { lettre: "و", transcription: "w", audio: "waw.mp3" },
    { lettre: "ي", transcription: "y", audio: "ya.mp3" }
  ];
  
  let scoreQuizAudio = 0;
  let bonneReponse = null;
  let audioCourant = null;
  
  function jouerQuestionPhonétique() {
    const zoneLettre = document.getElementById("quiz-lettre");
    const optionsZone = document.getElementById("quiz-options");
    const feedback = document.getElementById("quiz-feedback");
  
    const item = quizLettres[Math.floor(Math.random() * quizLettres.length)];
    bonneReponse = item.transcription;
    zoneLettre.textContent = item.lettre;
    feedback.textContent = "";
  
    // Audio actuel :
    audioCourant = new Audio(`audio/prononciation/${item.audio}`);
  
    // Choix : 1 bonne + 2 mauvaises
    const mauvaises = quizLettres
      .filter(l => l.transcription !== item.transcription)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    const toutesOptions = [item, ...mauvaises].sort(() => 0.5 - Math.random());
  
    // Affichage
    optionsZone.innerHTML = "";
    toutesOptions.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt.transcription;
      btn.onclick = () => {
        if (opt.transcription === bonneReponse) {
          feedback.innerHTML = `<span style="color:green;">✅ Correct !</span>`;
          scoreQuizAudio++;
        } else {
          feedback.innerHTML = `<span style="color:red;">❌ Mauvais choix.</span> La bonne réponse était : <strong>${bonneReponse}</strong>`;
        }
        document.getElementById("quiz-score").textContent = `Score : ${scoreQuizAudio}`;
        setTimeout(jouerQuestionPhonétique, 2500);
      };
      optionsZone.appendChild(btn);
    });
  }
  
  // 🔊 bouton audio
  const btnPlayAudio = document.getElementById("btn-audio-lettre");
  if (btnPlayAudio) {
    btnPlayAudio.addEventListener("click", () => {
      if (audioCourant) audioCourant.play();
    });
  }
  
  // 🔁 bouton rejouer
  const btnRestart = document.getElementById("btn-restart");
  if (btnRestart) {
    btnRestart.addEventListener("click", () => {
      scoreQuizAudio = 0;
      document.getElementById("quiz-score").textContent = "Score : 0";
      jouerQuestionPhonétique();
    });
  }
  
  // 📦 lancement initial
  if (document.getElementById("quiz-container")) {
    jouerQuestionPhonétique();
  }
  const phrasesSimples = [
    { arabe: "اِسْمِي عَلِيٌّ", traduction: "Je m'appelle Ali" },
    { arabe: "مَنْ أَنْتَ؟", traduction: "Qui es-tu ? (masc.)" },
    { arabe: "أَنَا تِلْمِيذٌ", traduction: "Je suis élève" },
    { arabe: "هِيَ طَالِبَةٌ", traduction: "Elle est étudiante" },
    { arabe: "هٰذَا بَيْتٌ", traduction: "Ceci est une maison" },
    { arabe: "ٱلْوَلَدُ طَوِيلٌ", traduction: "Le garçon est grand" },
    { arabe: "ٱلْبِنْتُ جَمِيلَةٌ", traduction: "La fille est belle" },
    { arabe: "أَيْنَ ٱلْكِتَابُ؟", traduction: "Où est le livre ?" },
    { arabe: "ٱلْكِتَابُ عَلَى ٱلطَّاوِلَةِ", traduction: "Le livre est sur la table" },
    { arabe: "أَنَا فِي ٱلْمَدْرَسَةِ", traduction: "Je suis à l'école" }
  ];
  
  let scorePhrases = 0;
  let phraseActuelle = null;
  
  function nouvelleQuestionPhrase() {
    const phraseZone = document.getElementById("phrase-question");
    const optionsZone = document.getElementById("phrase-options");
    const feedbackZone = document.getElementById("phrase-feedback");
    const boutonSuivant = document.getElementById("btn-next-phrase");
  
    const phrase = phrasesSimples[Math.floor(Math.random() * phrasesSimples.length)];
    phraseActuelle = phrase;
  
    let mauvaise;
    do {
      mauvaise = phrasesSimples[Math.floor(Math.random() * phrasesSimples.length)];
    } while (mauvaise.traduction === phrase.traduction);
  
    const options = [phrase.traduction, mauvaise.traduction].sort(() => 0.5 - Math.random());
  
    phraseZone.textContent = phrase.arabe;
    optionsZone.innerHTML = "";
    feedbackZone.textContent = "";
    boutonSuivant.style.display = "none";
  
    options.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.className = "quiz-btn-phrase";
      btn.onclick = () => {
        if (option === phrase.traduction) {
          feedbackZone.innerHTML = `<span style='color:green;'>✅ Bonne réponse !</span>`;
          scorePhrases++;
        } else {
          feedbackZone.innerHTML = `<span style='color:red;'>❌ Mauvaise réponse.</span><br><span style='color:green;'>✅ ${phrase.traduction}</span>`;
        }
  
        document.getElementById("phrase-score").textContent = "Score : " + scorePhrases;
        boutonSuivant.style.display = "inline-block";
      };
      optionsZone.appendChild(btn);
    });
  }
  
  const boutonSuivant = document.getElementById("btn-next-phrase");
  if (boutonSuivant) {
    boutonSuivant.addEventListener("click", () => {
      nouvelleQuestionPhrase();
    });
  }
  
  if (document.getElementById("quiz-phrases-simples")) {
    nouvelleQuestionPhrase();
  }
  

// --- Mobile sidebar toggle ---
(function(){
  const nav = document.querySelector('nav.sidebar');
  const btn = document.getElementById('mobile-menu-toggle');
  if(nav && btn){
    btn.addEventListener('click', ()=>{
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', (!expanded).toString());
      btn.setAttribute('aria-expanded', (!expanded).toString());
    });
  }
})();


// === Série générique: observer les scores et enregistrer toutes les 20 tentatives ===
(function(){
  const QUIZZES = [
    { anchor:'#quiz-container',     scoreSel:'#quiz-score',            id:'alphabet-phon-txt', title:'Alphabet phonétique (texte)' },
    { anchor:'#quiz-formes',        scoreSel:'#quiz-score-forme',      id:'formes-lettres',     title:'Formes des lettres' },
    { anchor:'#quiz-lettres-noms',  scoreSel:'#score-lettres-noms',    id:'noms-lettres',       title:'Nom des lettres' },
    { anchor:'#quiz-harakat',       scoreSel:'#harakat-score',         id:'harakat',            title:'Voyelles courtes (harakāt)' },
    { anchor:'#quiz-tanwin',        scoreSel:'#tanwin-score',          id:'tanwin',             title:'Tanwīn (doubles voyelles)' },
    { anchor:'#quiz-non-liantes',   scoreSel:'#score-non-liante',      id:'liaison-lettres',    title:'Lettres liantes / non liantes' },
    { anchor:'#quiz-mots-arabes',   scoreSel:'#score-mots-arabes',     id:'mots-simples',       title:'Mots simples' },
    { anchor:'#quiz-phrases',       scoreSel:'#phrase-score',          id:'phrases-simples',    title:'Phrases simples' }
  ];
  function parseScore(txt){ const m=String(txt||'').match(/(\d+)/); return m?parseInt(m[1],10):0; }
  function setup(q){
    const scoreEl = document.querySelector(q.scoreSel);
    if(!scoreEl) return;
    let tries = 0;
    const obs = new MutationObserver(()=>{
      const scoreVal = parseScore(scoreEl.textContent);
      tries++;
      if(tries>=20){
        const bonnes = scoreVal, total = 20, fautes = total - bonnes;
        if (typeof window.recordQuiz === 'function') window.recordQuiz(q.id,q.title,bonnes,fautes,total);
        if (typeof window.showInlineResult === 'function') window.showInlineResult(q.anchor,bonnes,fautes,total);
        tries = 0;
      }
    });
    obs.observe(scoreEl, {childList:true, characterData:true, subtree:true});
  }
  document.addEventListener('DOMContentLoaded', ()=> setTimeout(()=> QUIZZES.forEach(setup),0));
})();
