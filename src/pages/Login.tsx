import { 
  IonAlert,
  IonButton,
  IonContent, 
  IonInput, 
  IonInputPasswordToggle,  
  IonPage,  
  IonToast,  
  useIonRouter
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({ message, isOpen, onClose }) => {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onClose}
      header="Notification"
      message={message}
      buttons={['OK']}
    />
  );
};

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const doLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      return;
    }

    setShowToast(true); 
    setTimeout(() => {
      navigation.push('/it35-lab/app', 'forward', 'replace');
    }, 300);
  };
  
  return (
    <IonPage>
      <IonContent
        fullscreen
        style={{
          background: 'linear-gradient(180deg, #2b1055 0%, #7597de 100%)',
          backgroundImage: `url('/assets/winter-bg.png')`, // You need to add a similar background image in /public/assets
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div style={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '30px 20px',
          margin: '50px auto',
          width: '90%',
          maxWidth: '400px',
          color: 'white',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Login</h1>

          <IonInput
            label="Email"
            labelPlacement="floating"
            fill="outline"
            type="email"
            placeholder="Enter your email"
            value={email}
            onIonInput={e => setEmail(e.detail.value!)}
            style={{ marginBottom: '15px', color: 'white' }}
          />
          
          <IonInput
            label="Password"
            labelPlacement="floating"
            fill="outline"
            type="password"
            placeholder="Enter your password"
            value={password}
            onIonInput={e => setPassword(e.detail.value!)}
            style={{ marginBottom: '10px', color: 'white' }}
          >
            <IonInputPasswordToggle slot="end" />
          </IonInput>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.9rem',
            marginBottom: '20px',
            color: '#ccc'
          }}>
            <label>
              <input type="checkbox" style={{ marginRight: '5px' }} />
              Remember Me
            </label>
           
          </div>

          <IonButton onClick={doLogin} expand="block" shape="round" color="primary">
            Log In
          </IonButton>

          <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
            Don't have an account? 
            <a href="/it35-lab/app/home/signup" style={{ marginLeft: '5px', textDecoration: 'underline', color: 'lightblue' }}>
              Register
            </a>
          </p>
        </div>

        {/* Reusable AlertBox Component */}
        <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

        {/* IonToast for success message */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Login successful! Redirecting..."
          duration={1500}
          position="top"
          color="primary"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
