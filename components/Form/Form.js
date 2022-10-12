import React, { useEffect, useState } from 'react';
import styles from './Form.module.css';
import cn from 'classnames';
import md5 from 'md5';

import Modal from '../Modal/Modal';

const Form = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [promocode, setPromocode] = useState('');
	const [emailDirty, setEmailDirty] = useState(false);
	const [passwordDirty, setPasswordDirty] = useState(false);
	const [emailError, setEmailError] = useState('Por favor, insira um email válido.');
	const [passwordError, setPasswordError] = useState('Mínimo 8 símbolos');
	const [formValid, setFormValid] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [errorStatus, setErrorStatus] = useState(false);

	const country = 'BR';
	const currency = 'BRL';
	const secret = 'YH1ETLdNAr29v5TWbHBrjhw5QlU97dIl';
	const projectId = '8';
	const signature = md5(`${secret}${projectId}${email}`);
	const bonusChoice = '1';
	const url = `https://megapari.com/api/registrationbydata?id=${projectId}&country=${country}&currency=${currency}&sign=${signature}&email=${email}&password=${password}&send_reg_data=1&promocode=${promocode}&bonus_choice=${bonusChoice}`;

	const emailHandler = (e) => {
		setEmail(e.target.value);
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!re.test(String(e.target.value).toLowerCase())) {
			setEmailError('Por favor, insira um email válido.')
		} else {
			setEmailError('')
		}
	}

	const passwordHandler = (e) => {
		setPassword(e.target.value);
		const re = /^(?=.*[a-z])(?=.*\d)\S{8,}$/;
		if (!re.test(String(e.target.value).toLowerCase())) {
			setPasswordError('A senha deve conter apenas letras latinas e dígitos.')
		} else if (e.target.value.length < 8) {
			setPasswordError('Mínimo 8 símbolos')
		} else {
			setPasswordError('')
		}
	}

	const blurHandler = (e) => {
		switch (e.target.name) {
			case 'email':
				setEmailDirty(true);
				break;
			case 'password':
				setPasswordDirty(true);
				break;
		}
	}

	const refreshForm = () => {
		setErrorStatus(true);
		setEmail('');
		setPassword('');
		setPromocode('');
		setEmailDirty(false);
		setPasswordDirty(false);
		setEmailError('Por favor, insira um email válido.');
		setPasswordError('Mínimo 8 símbolos');
	}

	const handleSubmit = () => {
		if (!formValid) {
			setEmailDirty(true);
			setPasswordDirty(true);
		} else {
			setLoading(true);
			fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(res => res.json())
				.then(data => {
					if (data.success) {
						document.location.href = `https://megapari.com/${data.main}`;
					} else {
						setLoading(false);
						setErrorMessage(data.message);
						refreshForm();
					}
				})
				.catch(e => {
					setLoading(false);
					setErrorMessage(e.message);
					refreshForm();
				})
		}

	}

	useEffect(() => {
		if (emailError || passwordError) {
			setFormValid(false)
		} else {
			setFormValid(true)
		}
	}, [emailError, passwordError])

	return (
		<>
			<div className={styles.wrapper}>

				<div className={styles.info}>
					<p className={styles.bonus}>BÔNUS DE 100% O PRIMEIRO DEPÓSITO ATÉ</p>
					<p className={styles.money}>1000 BRL</p>
				</div>

				<div className={styles.inner}>

					<img className={styles.img} src="images/Logo.svg" alt="logo" />

					<form className={styles.form} onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}>

						<label className={styles.label}>Preencha o formulário e receba seu bônus</label>

						<div className={styles.currency}>
							<div className={styles.field}>
								BRASIL
							</div>
							<div className={styles.field}>
								BRL
							</div>
						</div>

						<input className={cn(styles.field, styles.email, {
							[styles.inputError]: emailDirty && emailError
						})} name="email" type="text" placeholder='E-MAIL' value={email}
							onChange={e => emailHandler(e)}
							onBlur={e => blurHandler(e)} />
						{(emailDirty && emailError) && (
							<div className={styles.error}>
								{emailError}
							</div>
						)}

						<input className={cn(styles.field, styles.password, {
							[styles.inputError]: passwordDirty && passwordError
						})} name="password" type="password" placeholder='SENHA' value={password}
							onChange={e => passwordHandler(e)}
							onBlur={e => blurHandler(e)} />
						{(passwordDirty && passwordError) && (
							<div className={styles.error}>
								{passwordError}
							</div>
						)}

						<div className={styles.bot}>
							<input className={styles.field} type="text" placeholder='Código promocional'
								value={promocode}
								onChange={e => setPromocode(e.target.value)} />
							<div className={styles.submitWrapper}>
								<input className={styles.submit} type="submit" value="REGISTRO" />
								{loading ? (
									<svg className={styles.loading} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ margin: 'auto', background: 'none', display: 'block', shapeRendering: 'auto' }} width="20px" height="20px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
										<circle cx="50" cy="50" fill="none" stroke="#ffffff" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138">
											<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
										</circle>
									</svg>
								) : null}
							</div>
						</div>

						<p className={styles.note}>EU CONCORDO COM OS TERMOS E CONDIÇÕES</p>
						<p className={styles.note}>CONCORDO EM RECEBER MENSAGENS VIA E-MAIL OU TELEFONE</p>

					</form>
				</div >

			</div >

			{errorStatus && <Modal errorMessage={errorMessage} setErrorStatus={setErrorStatus} />}
		</>

	);
}

export default Form;
