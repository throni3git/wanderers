import * as React from "react";

import styled from "styled-components";

import { ScrollComponent, ITileComponentProps } from "./tileComponents";
import { Colors, BORDER, BORDER_RADIUS } from "../constants";

import * as Store from "../store";

const ContactFormOuterContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px 20px;
`;

const ContactFormInnerContainer = styled.div`
	width: 600px;
`;

const ContactFormUnit = styled.div`
	width: 100%;
	display: flex;
	padding: 10px 0;
`;

const ContactFormLabel = styled.div`
	width: 200px;
	&[data-invalid="true"] {
		color: red;
	}
`;

const ContactFormInputDiv = styled.div`
	flex: 2;
`;

const ContactFormInputText = styled.input`
	width: 100%;
	border: ${BORDER + "px"} solid ${Colors.RulerColor};
	border-radius: ${BORDER_RADIUS + "px"};
	background: ${Colors.Background};
	color: ${Colors.DefaultTextColor};
	-webkit-appearance: none;
`;

const ContactFormInputSubmit = styled.input`
	width: 100%;
	border: ${BORDER + "px"} solid ${Colors.RulerColor};
	border-radius: ${BORDER_RADIUS + "px"};
	background: ${Colors.Background};
	color: ${Colors.DefaultTextColor};
	-webkit-appearance: none;
`;

const ContactFormInputCheckbox = styled.input`
	width: 100%;
	// border: ${BORDER + "px"} solid ${Colors.RulerColor};
	border-radius: ${BORDER_RADIUS + "px"};
	// -webkit-appearance: none;
`;

const ContactFormInputTextarea = styled.textarea`
	border: ${BORDER + "px"} solid ${Colors.RulerColor};
	border-radius: ${BORDER_RADIUS + "px"};
	background: ${Colors.Background};
	color: ${Colors.DefaultTextColor};
	min-height: 200px;
	resize: vertical;
	width: 100%;
	-webkit-appearance: none;
`;

const ValidationSpan = styled.span`
	color: ${Colors.LightTextColor};
	font-size: 0.9em;
`;

/**
 * Validates whether a field has a value
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @returns {string} - The error message
 */
export const required = (
	values: IContactTileState,
	fieldName: keyof IContactTileState
): string =>
	values[fieldName] === undefined ||
	values[fieldName] === null ||
	values[fieldName] === ""
		? "This must be populated"
		: "";

/**
 * Validates whether a field is within a certain amount of characters
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @param {number} length - The maximum number of characters
 * @returns {string} - The error message
 */
export const maxLength = (
	values: IContactTileState,
	fieldName: keyof IContactTileState,
	length: number
): string => {
	const value = values[fieldName];
	if (value && typeof value === "string" && value.length > length)
		return `This can not exceed ${length} characters`;
	else return "";
};

const MESSAGE_MAX_LENGTH = 1000;
const MESSAGE_MIN_LENGTH = 3;
const TEXTINPUT_MAX_LENGTH = 100;
const TEXTINPUT_MIN_LENGTH = 3;
const MAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export class ContactTile extends React.Component<
	IContactTileProps,
	IContactTileState
> {
	constructor(props: ContactTile["props"]) {
		super(props);
		this.state = INITIAL_STATE;
	}

	private checkName(): boolean {
		const contact = Store.getState().contact;
		const valid =
			contact.name.length >= TEXTINPUT_MIN_LENGTH &&
			contact.name.length < TEXTINPUT_MAX_LENGTH;
		this.setState({ isValidName: valid });
		return valid;
	}

	private checkMail(): boolean {
		const contact = Store.getState().contact;
		const valid = contact.mail.search(MAIL_REGEX) > -1;
		this.setState({ isValidMail: valid });
		return valid;
	}

	private checkMessage(): boolean {
		const contact = Store.getState().contact;
		const valid =
			contact.message.length >= MESSAGE_MIN_LENGTH &&
			contact.message.length < MESSAGE_MAX_LENGTH;
		this.setState({ isValidMessage: valid });
		return valid;
	}

	private checkDSGVO(): boolean {
		const contact = Store.getState().contact;
		this.setState({ isValidAcceptsDSGVO: contact.acceptsDSGVO });
		return contact.acceptsDSGVO;
	}

	private checkHuman(): boolean {
		const contact = Store.getState().contact;
		this.setState({ isValidIsHuman: contact.isHuman });
		return contact.isHuman;
	}

	private handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const target = event.target;
		const changedValue =
			target.type === "checkbox" ? target.checked : target.value;
		const changedEntry = target.name;

		const contact = Store.getState().contact;
		Store.setState("contact", { ...contact, [changedEntry]: changedValue });
	};

	private handleTextAreaChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		const target = event.target;
		const changedValue = target.value;
		const changedEntry = target.name;

		const contact = Store.getState().contact;
		Store.setState("contact", { ...contact, [changedEntry]: changedValue });
	};

	private onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const contact = Store.getState().contact;

		console.log(event);
		console.log(contact);

		const areAllEntriedValid =
			this.checkName() &&
			this.checkMail() &&
			this.checkMessage() &&
			this.checkDSGVO() &&
			this.checkHuman();

		const senderGetsCopy = Store.getState().contact.sendCopy;

		let sendMailResult: string;
		if (areAllEntriedValid) {
			console.log("ALL VALID");
			try {
				const contact = Store.getState().contact;

				sendMailResult = await this.sendMail(
					"[HP] Nachricht von " + contact.name,
					contact.mail,
					contact.message,
					senderGetsCopy
				);
			} catch (e) {
				this.setState({
					successMessage: "The message couldn't be sent."
				});
				return;
			}

			console.log(sendMailResult);

			if (sendMailResult !== "1") {
				this.setState({
					successMessage: "The message couldn't be sent."
				});
			} else {
				Store.setState("contact", Store.INITIAL_CONTACT);
				this.setState({
					successMessage: "The message was sent. We will reply soon."
				});
			}
		} else {
			this.setState({ successMessage: "Please check your entries." });
			console.log("NOPE");
		}
	};

	private sendMail(
		heading: string,
		returnMail: string,
		message: string,
		sendCopy: boolean
	): Promise<string> {
		// const resultPromise = new Promise<boolean>((resolve, reject) => {
		// 	const xhr = new XMLHttpRequest();
		// 	xhr.open("POST", "./mail_api_send.php", true);
		// 	xhr.setRequestHeader("Content-Type", "application/json");
		// 	xhr.onreadystatechange = function() {
		// 		if (xhr.readyState == 4) {
		// 			if (xhr.status == 200) {
		// 				console.log("success");
		// 			} else {
		// 				console.log("fail");
		// 			}
		// 			console.log(xhr);
		// 		}
		// 	};
		// 	xhr.onerror = () => {
		// 		reject(xhr);
		// 	};
		// 	const publishingJson = {
		// 		mail_heading: heading,
		// 		mail_content: message,
		// 		mail_from: returnMail,
		// 		DBG_CONTACT_TILE: DBG_CONTACT_TILE
		// 	};
		// 	xhr.send(JSON.stringify(publishingJson));
		// });
		// return resultPromise;

		const publishingJson = {
			mail_heading: heading,
			mail_content: message,
			mail_from: returnMail,
			send_copy_to_sender: sendCopy,
			DBG_CONTACT_TILE: Store.getState().debug.debugContact
		};

		return fetch("./mail_api_send.php", {
			method: "POST",
			body: JSON.stringify(publishingJson)
		}).then((res) => res.text());
	}

	public render() {
		return (
			<ScrollComponent>
				<ContactFormOuterContainer>
					<ContactFormInnerContainer>
						<form onSubmit={this.onSubmit}>
							<ContactFormUnit>
								<ContactFormLabel
									data-invalid={
										this.state.isValidName === false
									}
								>
									Name
								</ContactFormLabel>
								<ContactFormInputDiv>
									<ContactFormInputText
										type="text"
										name="name"
										value={Store.getState().contact.name}
										onChange={this.handleInputChange}
									/>
								</ContactFormInputDiv>
							</ContactFormUnit>
							<ContactFormUnit>
								<ContactFormLabel
									data-invalid={
										this.state.isValidMail === false
									}
								>
									Mail
								</ContactFormLabel>
								<ContactFormInputDiv>
									<ContactFormInputText
										type="text"
										name="mail"
										value={Store.getState().contact.mail}
										onChange={this.handleInputChange}
									/>
								</ContactFormInputDiv>
							</ContactFormUnit>
							<ContactFormUnit>
								<ContactFormLabel
									data-invalid={
										this.state.isValidMessage === false
									}
								>
									Text{" "}
									<ValidationSpan>
										{MESSAGE_MAX_LENGTH -
											Store.getState().contact.message
												.length}
									</ValidationSpan>
								</ContactFormLabel>
								<ContactFormInputDiv>
									<ContactFormInputTextarea
										name="message"
										maxLength={1000}
										value={Store.getState().contact.message}
										onChange={this.handleTextAreaChange}
									/>
								</ContactFormInputDiv>
							</ContactFormUnit>
							<ContactFormUnit>
								<ContactFormLabel
									data-invalid={
										this.state.isValidAcceptsDSGVO === false
									}
								>
									Accept{" "}
									<a
										style={{ cursor: "pointer" }}
										onClick={() =>
											this.props.contentSwitcher!(
												"Impressum"
											)
										}
									>
										DSGVO
									</a>
								</ContactFormLabel>
								<ContactFormInputDiv>
									<ContactFormInputCheckbox
										type="checkbox"
										name="acceptsDSGVO"
										checked={
											Store.getState().contact
												.acceptsDSGVO
										}
										onChange={this.handleInputChange}
									/>
								</ContactFormInputDiv>
							</ContactFormUnit>
							<ContactFormUnit>
								<ContactFormLabel
									data-invalid={
										this.state.isValidIsHuman === false
									}
								>
									I am a human from the earth
								</ContactFormLabel>
								<ContactFormInputDiv>
									<ContactFormInputCheckbox
										type="checkbox"
										name="isHuman"
										checked={
											Store.getState().contact.isHuman
										}
										onChange={this.handleInputChange}
									/>
								</ContactFormInputDiv>
							</ContactFormUnit>
							<ContactFormUnit>
								<ContactFormLabel>
									Send a copy to me
								</ContactFormLabel>
								<ContactFormInputDiv>
									<ContactFormInputCheckbox
										type="checkbox"
										name="sendCopy"
										checked={
											Store.getState().contact.sendCopy
										}
										onChange={this.handleInputChange}
									/>
								</ContactFormInputDiv>
							</ContactFormUnit>
							<ContactFormUnit>
								<ContactFormInputSubmit
									type="submit"
									value="Submit"
								/>
							</ContactFormUnit>
							<ContactFormUnit>
								{this.state.successMessage}
							</ContactFormUnit>
						</form>
					</ContactFormInnerContainer>
				</ContactFormOuterContainer>
			</ScrollComponent>
		);
	}
}

export interface IContactTileProps extends ITileComponentProps {}

interface IContactTileState {
	isValidMail?: boolean;
	isValidName?: boolean;
	isValidAcceptsDSGVO?: boolean;
	isValidIsHuman?: boolean;
	isValidMessage?: boolean;
	successMessage?: string;
}

const INITIAL_STATE: IContactTileState = {
	successMessage: "",
	isValidAcceptsDSGVO: undefined,
	isValidIsHuman: undefined,
	isValidMail: undefined,
	isValidMessage: undefined,
	isValidName: undefined
};
