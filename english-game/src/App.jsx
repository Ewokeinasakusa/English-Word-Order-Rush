import { useState, useEffect } from "react"

function App() {
  const levels = {
    1: [
      ["I", "run."],
      ["Dogs", "bark."],
      ["Birds", "fly."],
      ["We", "smile."],
      ["I", "am", "happy."],
      ["She", "is", "busy."],
      ["They", "are", "kind."],
      ["This", "is", "my dog."],
    ],

    2: [
      ["I", "play", "soccer."],
      ["She", "likes", "music."],
      ["We", "study", "English."],
      ["They", "watch", "movies."],
      ["I", "eat", "apples."],
      ["He", "reads", "books."],
      ["We", "clean", "rooms."],
      ["She", "drinks", "milk."],
    ],

    3: [
      ["I", "can", "swim."],
      ["She", "can", "dance."],
      ["We", "will", "win."],
      ["He", "will", "come."],
      ["You", "must", "study."],
      ["I", "can", "read", "English."],
      ["They", "can", "play", "tennis."],
    ],

    4: [
      ["I", "play", "soccer", "today."],

      [
        "We",
        "study",
        "English",
        "every day.",
      ],

      [
        "She",
        "watches",
        "TV",
        "at night.",
      ],

      [
        "He",
        "runs",
        "in the morning.",
      ],

      [
        "I",
        "read",
        "books",
        "after school.",
      ],
    ],

    5: [
      [
        "I",
        "study",
        "at school.",
      ],

      [
        "She",
        "plays",
        "in the park.",
      ],

      [
        "We",
        "eat",
        "at home.",
      ],

      [
        "They",
        "swim",
        "in the pool.",
      ],

      [
        "He",
        "reads",
        "in the library.",
      ],
    ],

    6: [
      [
        "I",
        "usually",
        "play",
        "soccer.",
      ],

      [
        "She",
        "often",
        "reads",
        "books.",
      ],

      [
        "We",
        "always",
        "eat",
        "together.",
      ],

      [
        "He",
        "sometimes",
        "watches",
        "TV.",
      ],
    ],
  }

  function shuffle(array) {
    const newArr = [...array]

    for (
      let i = newArr.length - 1;
      i > 0;
      i--
    ) {
      const j = Math.floor(
        Math.random() * (i + 1)
      )

      ;[newArr[i], newArr[j]] = [
        newArr[j],
        newArr[i],
      ]
    }

    return newArr
  }

  function getProblem(level, index) {
    const problems = levels[level]

    return problems[
      index % problems.length
    ]
  }

  const [correctSound] = useState(
    new Audio("/correct.mp3")
  )

  const [stageClearSound] = useState(
    new Audio("/stageclear.mp3")
  )

  const [level, setLevel] = useState(1)

  const [problemIndex, setProblemIndex] =
    useState(0)

  const [currentProblem, setCurrentProblem] =
    useState(getProblem(1, 0))

  const [words, setWords] = useState(
    shuffle(getProblem(1, 0))
  )

  const [answer, setAnswer] = useState([])

  const [time, setTime] =
    useState(0)

  const [showStageClear, setShowStageClear] =
    useState(false)

  const [clearedStage, setClearedStage] =
    useState(1)

  const [isFinished, setIsFinished] =
    useState(false)

  const [bestTime, setBestTime] =
    useState(
      Number(
        localStorage.getItem("bestTime")
      )
    )

  useEffect(() => {
    if (isFinished) return

    const timer = setInterval(() => {
      setTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isFinished])

  function addWord(word) {
    if (answer.includes(word)) return

    if (isFinished) return

    setAnswer([...answer, word])
  }

  function removeWord(index) {
    const newAnswer = [...answer]

    newAnswer.splice(index, 1)

    setAnswer(newAnswer)
  }

  function nextProblem() {
    const nextIndex =
      problemIndex + 1

    const problemsLength =
      levels[level].length

    const isStageComplete =
      nextIndex >= problemsLength

    if (isStageComplete) {
      if (level === 6) {
        setIsFinished(true)

        const savedBest =
          localStorage.getItem(
            "bestTime"
          )

        if (
          !savedBest ||
          time < Number(savedBest)
        ) {
          localStorage.setItem(
            "bestTime",
            time
          )

          setBestTime(time)
        }

        return
      }

      setAnswer([])

      setClearedStage(level)

      setShowStageClear(true)

      stageClearSound.currentTime = 0

      stageClearSound.play()

      setTimeout(() => {
        const nextLevel =
          level + 1

        const newProblem =
          getProblem(nextLevel, 0)

        setLevel(nextLevel)

        setProblemIndex(0)

        setCurrentProblem(newProblem)

        setWords(shuffle(newProblem))

        setAnswer([])

        setShowStageClear(false)
      }, 800)

    } else {
      const newProblem =
        getProblem(level, nextIndex)

      setProblemIndex(nextIndex)

      setCurrentProblem(newProblem)

      setWords(shuffle(newProblem))

      setAnswer([])
    }
  }

  const correctAnswer =
    currentProblem?.join(" ") || ""

  const currentSentence =
    answer.join(" ")

  const isCorrect =
    currentSentence === correctAnswer

  useEffect(() => {
    if (
      isCorrect &&
      answer.length > 0 &&
      !showStageClear &&
      !isFinished
    ) {
      correctSound.currentTime = 0

      correctSound.play()

      setTimeout(() => {
        nextProblem()
      }, 500)
    }
  }, [isCorrect])

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Word Order Rush
      </h1>

      <div style={styles.level}>
        Level: {level}
      </div>

      <div style={styles.score}>
        Time: {time}s
      </div>

      <div style={styles.wordArea}>
        {words.map((word) => (
          <button
            key={word}
            style={{
              ...styles.wordCard,

              ...(word.includes(" ")
                ? styles.chunkCard
                : {}),

              ...(answer.includes(word)
                ? styles.usedCard
                : {}),
            }}
            onClick={() => addWord(word)}
            disabled={
              answer.includes(word) ||
              isFinished
            }
          >
            {word}
          </button>
        ))}
      </div>

      <div style={styles.answerArea}>
        {isFinished ? (
          <div style={styles.finalClear}>
            <div>
              FINAL CLEAR!
            </div>

            <div>
              Time: {time}s
            </div>

            <div>
              {bestTime === time
                ? "NEW RECORD!"
                : `Best: ${bestTime}s`}
            </div>
          </div>

        ) : showStageClear ? (
          <div style={styles.stageClear}>
            Stage {clearedStage} Clear!
          </div>

        ) : (
          answer.map((word, index) => (
            <button
              key={index}
              style={styles.answerWord}
              onClick={() =>
                removeWord(index)
              }
            >
              {word}
            </button>
          ))
        )}
      </div>

      <button
        style={styles.resetButton}
        onClick={() => {
          const firstProblem =
            getProblem(1, 0)

          setLevel(1)

          setProblemIndex(0)

          setCurrentProblem(firstProblem)

          setWords(shuffle(firstProblem))

          setAnswer([])

          setTime(0)

          setShowStageClear(false)

          setIsFinished(false)

          setBestTime(
            Number(
              localStorage.getItem(
                "bestTime"
              )
            )
          )
        }}
      >
        Restart
      </button>
    </div>
  )
}

const styles = {
  container: {
    textAlign: "center",

    marginTop: "5px",

    fontFamily: "sans-serif",
  },

  title: {
    fontSize: "40px",

    marginTop: "50px",
    
    marginBottom: "20px",
  },

  level: {
    fontSize: "28px",

    marginBottom: "10px",
  },

  score: {
    fontSize: "32px",

    marginBottom: "10px",
  },

  wordArea: {
    display: "flex",

    justifyContent: "center",

    gap: "16px",

    marginBottom: "16px",

    padding: "20px",

    borderRadius: "20px",

    flexWrap: "wrap",
  },

  wordCard: {
    fontSize: "28px",

    padding: "16px 24px",

    borderRadius: "12px",

    border: "none",

    cursor: "pointer",

    backgroundColor: "#4f46e5",

    color: "white",

    boxShadow:
      "0 4px 8px rgba(0,0,0,0.2)",
  },

  chunkCard: {
    fontSize: "24px",

    padding: "16px 32px",

    backgroundColor: "#0f766e",
  },

  usedCard: {
    backgroundColor: "#9ca3af",

    opacity: 0.5,
  },

  answerArea: {
    display: "flex",

    justifyContent: "center",

    alignItems: "flex-start", // ← 「center」から「flex-start」に変更（上詰めに配置）",

    gap: "12px",

    marginTop: "10px",

    //minHeight: "100px",
    height: "160px",

    marginBottom: "30px",

    flexWrap: "wrap",
  },

  answerWord: {
    fontSize: "28px",

    padding: "12px 20px",

    borderRadius: "12px",

    border: "none",

    backgroundColor: "#10b981",

    color: "white",

    cursor: "pointer",
  },

  resetButton: {
    fontSize: "16px",

    padding: "8px 16px",

    borderRadius: "8px",

    border: "none",

    backgroundColor: "#f3f4f6",

    color: "#6b7280",
    
    cursor: "pointer",

    marginTop: "20px",
  },

  stageClear: {
    fontSize: "42px",

    color: "#f59e0b",

    fontWeight: "bold",

    padding: "10px 20px",
  },

  finalClear: {
    fontSize: "40px",

    color: "#f59e0b",

    fontWeight: "bold",

    lineHeight: "1.6",
  },
}

export default App