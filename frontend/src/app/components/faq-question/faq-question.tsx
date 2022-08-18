import styles from './faq-question.module.scss';

interface props {
  question: string;
  answer: string;
}

const FaqQuestion = (props: props) => {
  return (
    <div className={styles.question}>
      <span>{props.question}</span>
      <span className={styles.answer}>{props.answer}</span>
    </div>
  )
}

export default FaqQuestion;


