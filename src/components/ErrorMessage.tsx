interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="error-message">
    <p>{message}</p>
    <style jsx>{`
      .error-message {
        text-align: center;
        color: red;
        font-size: 1.2rem;
        padding: 2rem;
      }
    `}</style>
  </div>
);

export default ErrorMessage;
