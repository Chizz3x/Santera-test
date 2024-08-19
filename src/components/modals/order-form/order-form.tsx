import React from "react";
import styled from "styled-components";
import { NModals, changeModals } from "../modals";
import { ModalLayout } from "../layout";
import { Controller, useForm } from "react-hook-form";
import yupValidationResolver from "../../../utils/yup-validation-resolver";
import * as yup from 'yup'
import { Autocomplete, Button, TextField } from "@mui/material";
import { toast } from "react-toastify";

enum orderStatus {
	'PENDING' = 1,
	'PAID' = 2,
	'COMPLETED' = 3
}

const orderStatusEntries = Object.entries(orderStatus);
const orderStatusArray = orderStatusEntries.slice(orderStatusEntries.length / 2);

const orderLinkDomain = "https://pmp.pigugroup.eu";
const orderLinkRoute = "/order";

const getDefaultFormData = (): NModalOrderForm.IFormOrder => {
	return {
		id: '',
		link: '',
		price: 0,
		status: orderStatus.PENDING
	}
}

const onlyNumbers: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
	if (event.key === '+' || event.key === '-' || event.key.toLowerCase() === 'e') {
		event.preventDefault();
	}
}

const name = "ModalOrderForm";
const Modal = (props: NModalOrderForm.IProps) => {
	const [idState, setIdState] = React.useState<boolean>(false);
	const [disableForm, setDisableForm] = React.useState<boolean>(false);
	const [toastTimeout, setToastTimeout] = React.useState<NodeJS.Timeout | null>(null);

	const validationSchema: yup.ObjectSchema<NModalOrderForm.IFormOrder> =
    yup.object({
			id: yup.string().required(),
			link: yup.string().required(),
			price: yup.number().required(),
			status: yup.number().required()
		});

	const {
		register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: formErrors },
    control: controlForm,
    reset: resetForm,
    setValue: setFormValue,
	} = useForm({
		resolver: yupValidationResolver(
      validationSchema,
    ),
    defaultValues: getDefaultFormData(),
	});

	const onSubmit = handleSubmitForm(async data => {
		console.log('data:', data);
		setDisableForm(true);
		setTimeout(() => {
			resetForm();
			setDisableForm(false);
		}, 3000);
	});

	const closeModal: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if(event.currentTarget === event.target) {
      window.dispatchEvent(changeModals({ [name]: null }));
    }
  };

	const getIDFromLink = (link: string) => {
		if(link.startsWith(`${orderLinkDomain}${orderLinkRoute}`)) {
			return link.split('?')?.[0]?.split?.('/')?.slice(-1)?.[0];
		}
		return undefined;
	}

	const handleLinkPaste: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
		const id = getIDFromLink(event.target.value);
		if(id) {
			setFormValue('id', id);
			setIdState(!!id);
			if(toastTimeout)
				clearTimeout(toastTimeout);
			setToastTimeout(
				setTimeout(() => {
					toast(`Order ${id} found!`);
				}, 1000)
			);
		}
	}

  return <ModalLayout {...props} name={name}>
    <ModalExampleStyle>
      <div className={`${name}-header`}>
				<h2>Order form</h2>
			</div>
			<div className={`${name}-body`}>
				<form onSubmit={onSubmit}>
					<div className={`${name}-form-body`}>
						<TextField
							{...registerForm('id')}
							disabled={disableForm}
							required
							size="small"
							label="Order ID"
							onChange={(event) => setIdState(!!event.target.value || idState)}
							onFocus={() => setIdState(true)}
							onBlur={(event) => setIdState(!!event.target.value)}
							InputLabelProps={{
								shrink: idState
							}}
						/>
						<TextField
							{...registerForm('link')}
							disabled={disableForm}
							required
							size="small"
							label="Order link"
							onChange={handleLinkPaste}
						/>
						<TextField
							{...registerForm('price')}
							disabled={disableForm}
							required
							size="small"
							label="Price"
							type="number"
							InputProps={{inputProps: {min: 0}}}
							onKeyDown={onlyNumbers}
						/>
						<Controller
							name="status"
							control={controlForm}
							render={({ field }) => (
								<Autocomplete
									disabled={disableForm}
									disableClearable
									size="small"
									filterOptions={_ => _}
									isOptionEqualToValue={(o, v) => o.value === v.value}
									value={{
										label: orderStatus[field?.value],
										value: field?.value
									}}
									renderInput={params => (
										<TextField
											{...params}
											label='Status'
											error={
												!!formErrors
													.status
													?.message}
										/>
									)}
									options={orderStatusArray.map(m => ({
										label: m[0],
										value: m[1],
									}))}
								/>
							)}
						/>
					</div>
					<div className={`${name}-footer`}>
						<Button onClick={closeModal}>Close</Button>
						<Button type='submit' variant="contained">Submit</Button>
					</div>
				</form>
			</div>	
    </ModalExampleStyle>
  </ModalLayout>;
};

export { name, Modal };

export namespace NModalOrderForm {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface IProps extends NModals.IDefaultProps {
		// ---
	}
	export interface IFormOrder {
		id: string;
		link: string;
		price: number;
		status: number;
	}
}

const ModalExampleStyle = styled.div`
	background-color: white;
	border-radius: 10px;
	padding: 10px 20px;
	min-width: 300px;
	box-shadow: 0 0 10px #00000053;

	> *:not(:last-child) {
		margin-bottom: 15px;
	}

	.${name}-header {
		//
	}
	.${name}-body {
		//
		.${name}-form-body {
			display: flex;
			flex-direction: column;
			> *:not(:last-child) {
				margin-bottom: 10px;
			}
		}
	}
	.${name}-footer {
		margin-top: 15px;
		display: flex;
		justify-content: flex-end;
		> *:not(:last-child) {
			margin-right: 10px;
		}
	}
`;