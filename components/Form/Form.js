import React, { useEffect, useState } from 'react';
import styles from './Form.module.css';
import cn from 'classnames';
import Image from 'next/image';
import md5 from 'md5';


// const handleSubmission = async (e, phone, variant, variant2) => {
// 	e.preventDefault();

// 	const formData = {
// 		"phone": phone,
// 		"type": 'Заявка на расчёт',
// 		"contactType": variant,
// 		"whereType": variant2,
// 		"guests": document.getElementById("guests").value
// 	}

// 	fetch('/api/order', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify(formData)
// 	})
// 		.then(res => res.json())
// 		.then(data => {
// 			if (data) console.log(data)
// 		})
// 		.catch(err => {
// 			console.error(err)
// 		})
// }

const Form = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [promocode, setPromocode] = useState('');
	const [emailDirty, setEmailDirty] = useState(false);
	const [passwordDirty, setPasswordDirty] = useState(false);
	const [emailError, setEmailError] = useState('Por favor, insira um email válido.');
	const [passwordError, setPasswordError] = useState('Mínimo 8 símbolos');
	const [formValid, setFormValid] = useState(false);

	const country = 'BR';
	const currency = 'BRL';
	const secret = 'YH1ETLdNAr29v5TWbHBrjhw5QlU97dIl';
	const projectId = '8'
	const signature = md5(`${secret}${projectId}${email}`);
	const bonusChoice = '1';
	const url = `https://megapari.com/api/registrationbydata?id=${projectId}&country=${country}&currency=${currency}&sign=${signature}&email=${email}&send_reg_data=1&promocode=${promocode}&bonus_choice=${bonusChoice}`;

	console.log(signature);
	console.log(url);

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
		const re = /^[a-zA-Z0-9]+$/;
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

	const handleSubmit = () => {
		if (!formValid) {
			setEmailDirty(true);
			setPasswordDirty(true);
			return console.log('fail');
		} else {
			console.log('success');
			fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(res => res.json())
				.then(data => {
					if (data.success) {
						console.log(data.main)
						fetch(`https://megapari.com/${data.main}`)
							.then(data => {
								console.log(data)
								document.location.href = data.url
							})
							.catch(e => console.log(e))
						console.log(data);
					} else {
						alert(data.message);
					}
				})
				.catch(e => {
					console.log(e)
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

	console.log(promocode);

	return (
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
						<input className={styles.submit} type="submit" value="REGISTRO" />
					</div>

					<p className={styles.note}>EU CONCORDO COM OS TERMOS E CONDIÇÕES</p>
					<p className={styles.note}>CONCORDO EM RECEBER MENSAGENS VIA E-MAIL OU TELEFONE</p>

				</form>
			</div>

		</div>
	);
}

export default Form;
