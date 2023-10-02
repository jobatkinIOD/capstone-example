import ImageForm from '../components/ImageForm';
import LoginMUI from '../components/LoginMUI';

export default function Homepage() {
  // Save in pages/Homepage.jsx
  return (
    <div className="Homepage">
      <h1>Home</h1>

      <LoginMUI />

      <ImageForm />

    </div>
  );
}
