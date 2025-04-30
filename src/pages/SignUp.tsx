import React, { useState } from 'react';
import {
    IonButton,
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    IonPage,
    IonModal,
    IonText,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonAlert,
    IonTitle,
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import bcrypt from 'bcryptjs';

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

const SignUp: React.FC = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const handleOpenVerificationModal = () => {
        if (!email.endsWith("@nbsc.edu.ph")) {
            setAlertMessage("Only @nbsc.edu.ph emails are allowed to register.");
            setShowAlert(true);
            return;
        }

        if (password !== confirmPassword) {
            setAlertMessage("Passwords do not match.");
            setShowAlert(true);
            return;
        }

        setShowVerificationModal(true);
    };

    const doRegister = async () => {
        setShowVerificationModal(false);

        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw new Error("Account creation failed: " + error.message);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const { error: insertError } = await supabase.from("users").insert([{
                username,
                user_email: email,
                user_firstname: firstName,
                user_lastname: lastName,
                user_password: hashedPassword,
            }]);

            if (insertError) {
                throw new Error("Failed to save user data: " + insertError.message);
            }

            setShowSuccessModal(true);
        } catch (err) {
            if (err instanceof Error) {
                setAlertMessage(err.message);
            } else {
                setAlertMessage("An unknown error occurred.");
            }
            setShowAlert(true);
        }
    };

    return (
        <IonPage>
            <IonContent
                fullscreen
                style={{
                    background: 'linear-gradient(180deg, #2b1055 0%, #7597de 100%)',
                    backgroundImage: `url('/assets/winter-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                }}
            >
                {/* 🔄 Rotating colorful background */}
                <div className="rotating-bg"></div>

                {/* 🔒 Card container */}
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
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Create your account</h1>

                    <IonInput label="Username" labelPlacement="floating" fill="outline" color="success" type="text" placeholder="Enter a unique username" value={username} onIonInput={e => setUsername(e.detail.value!)} style={{ marginBottom: '15px', color: 'red' }} />
                    <IonInput label="First Name" labelPlacement="floating" fill="outline"color="success"  type="text" placeholder="Enter your first name" value={firstName} onIonInput={e => setFirstName(e.detail.value!)} style={{ marginBottom: '15px', color: 'red' }} />
                    <IonInput label="Last Name" labelPlacement="floating" fill="outline" color="success" type="text" placeholder="Enter your last name" value={lastName} onIonInput={e => setLastName(e.detail.value!)} style={{ marginBottom: '15px', color: 'red' }} />
                    <IonInput label="Email" labelPlacement="floating" fill="outline" color="success" type="email" placeholder="youremail@nbsc.edu.ph" value={email} onIonInput={e => setEmail(e.detail.value!)} style={{ marginBottom: '15px', color: 'red' }} />
                    <IonInput label="Password" labelPlacement="floating" fill="outline" color="success" type="password" placeholder="Enter password" value={password} onIonInput={e => setPassword(e.detail.value!)} style={{ marginBottom: '15px', color: 'red' }}>
                        <IonInputPasswordToggle slot="end" />
                    </IonInput>
                    <IonInput label="Confirm Password" labelPlacement="floating" fill="outline" color="success" type="password" placeholder="Confirm password" value={confirmPassword} onIonInput={e => setConfirmPassword(e.detail.value!)} style={{ marginBottom: '15px', color: 'red' }}>
                        <IonInputPasswordToggle slot="end" />
                    </IonInput>

                    <IonButton onClick={handleOpenVerificationModal} expand="block" color="danger" style={{ marginTop: '10px' }}>
                        Register
                    </IonButton>
                    <IonButton routerLink="/it35-lab" expand="block" fill="clear" style={{ color: 'lightblue', marginTop: '10px' }}>
                        Already have an account?
                    </IonButton>
                </div>

                {/* Verification Modal */}
                <IonModal isOpen={showVerificationModal} onDidDismiss={() => setShowVerificationModal(false)}>
                    <IonContent className="ion-padding">
                        <IonCard className="ion-padding" style={{ marginTop: '20%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white' }}>
                            <IonCardHeader>
                                <IonCardTitle>User Registration Details</IonCardTitle>
                                <hr />
                                <IonCardSubtitle>Username</IonCardSubtitle>
                                <IonCardTitle>{username}</IonCardTitle>

                                <IonCardSubtitle>Email</IonCardSubtitle>
                                <IonCardTitle>{email}</IonCardTitle>

                                <IonCardSubtitle>Name</IonCardSubtitle>
                                <IonCardTitle>{firstName} {lastName}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent></IonCardContent>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '5px' }}>
                                <IonButton fill="clear" onClick={() => setShowVerificationModal(false)}>Cancel</IonButton>
                                <IonButton color="primary" onClick={doRegister}>Confirm</IonButton>
                            </div>
                        </IonCard>
                    </IonContent>
                </IonModal>

                {/* Success Modal */}
                <IonModal isOpen={showSuccessModal} onDidDismiss={() => setShowSuccessModal(false)}>
                    <IonContent className="ion-padding" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', marginTop: '35%' }}>
                        <IonTitle style={{ marginBottom: '10px' }}>Registration Successful 🎉</IonTitle>
                        <IonText>
                            <p>Your account has been created successfully.</p>
                            <p>Please check your email inbox!</p>
                        </IonText>
                        <IonButton routerLink="/it35-lab" routerDirection="back" color="danger" style={{ marginTop: '20px' }}>
                            Go to Login
                        </IonButton>
                    </IonContent>
                </IonModal>

                <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />
            </IonContent>
        </IonPage>
    );
};

export default SignUp;
