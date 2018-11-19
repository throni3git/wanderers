import * as React from "react";

import styled from "styled-components";

import { ScrollComponent, ITileComponentProps } from "./tileComponents";
import { Colors, BORDER, BORDER_RADIUS } from "../constants";
import { DBG_CONTACT_TILE } from "../urlParams";

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
	border: ${BORDER + "px"} solid ${Colors.LightTextColor};
	border-radius: ${BORDER_RADIUS + "px"};
	background: rgba(255, 255, 255, 0.6);
	-webkit-appearance: none;
`;

const ContactFormInputSubmit = styled.input`
	width: 100%;
	border: ${BORDER + "px"} solid ${Colors.LightTextColor};
	border-radius: ${BORDER_RADIUS + "px"};
	background: rgba(255, 255, 255, 0.6);
	-webkit-appearance: none;
`;

const ContactFormInputCheckbox = styled.input`
	width: 100%;
	// border: ${BORDER + "px"} solid ${Colors.LightTextColor};
	border-radius: ${BORDER_RADIUS + "px"};
	// -webkit-appearance: none;
`;

const ContactFormInputTextarea = styled.textarea`
	width: 100%;
	min-height: 200px;
	resize: vertical;
	border: ${BORDER + "px"} solid ${Colors.LightTextColor};
	border-radius: ${BORDER_RADIUS + "px"};
	background: rgba(255, 255, 255, 0.6);
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
	fieldName: string
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
	fieldName: string,
	length: number
): string =>
	values[fieldName] && values[fieldName].length > length
		? `This can not exceed ${length} characters`
		: "";

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
		this.state = {
			name: "",
			mail: "",
			message: "",
			acceptsDSGVO: false,
			isHuman: false
		};

		if (DBG_CONTACT_TILE) {
			this.state = {
				...this.state,
				name: "Test",
				mail: "throni3@gmx.de",
				message: "Wir testen und wir testen",
				acceptsDSGVO: true,
				isHuman: true
			};
		}
	}

	private entryValidation = (
		entryName: string,
		type: "text" | "textarea" | "checkbox"
	): { message: string; valid: boolean } => {
		const trueResult = { valid: true, message: "" };
		const falseResult = { valid: false, message: "*" };

		switch (type) {
			case "text": {
				const textContent = this.state[entryName];
				if (
					textContent.length >= TEXTINPUT_MIN_LENGTH &&
					textContent.length < TEXTINPUT_MAX_LENGTH
				) {
					return { ...trueResult, message: "" };
				} else {
					return { ...falseResult, message: "*" };
				}

				break;
			}
			case "textarea": {
				const textContent = this.state[entryName];
				const remainingChars = MESSAGE_MAX_LENGTH - textContent.length;
				if (
					textContent.length >= MESSAGE_MIN_LENGTH &&
					textContent.length < MESSAGE_MAX_LENGTH
				) {
					return { ...trueResult, message: "" + remainingChars };
				} else if (textContent.length < MESSAGE_MIN_LENGTH) {
					return { ...falseResult, message: "*" + remainingChars };
				} else {
					return { ...falseResult, message: "" + remainingChars };
				}
				break;
			}
			case "checkbox": {
				return this.state[entryName] ? trueResult : falseResult;
				break;
			}
		}
	};

	private checkName(): void {
		const valid =
			this.state.name.length >= TEXTINPUT_MIN_LENGTH &&
			this.state.name.length < TEXTINPUT_MAX_LENGTH;
		this.setState({ isValidName: valid });
	}

	private checkMail(): void {
		const valid =
			!!this.state.mail && this.state.mail.search(MAIL_REGEX) > -1;
		this.setState({ isValidMail: valid });
	}

	private checkMessage(): void {
		const valid =
			this.state.message.length >= MESSAGE_MIN_LENGTH &&
			this.state.message.length < MESSAGE_MAX_LENGTH;
		this.setState({ isValidMessage: valid });
	}

	private checkDSGVO(): void {
		this.setState({ isValidAcceptsDSGVO: this.state.acceptsDSGVO });
	}

	private checkHuman(): void {
		this.setState({ isValidIsHuman: this.state.isHuman });
	}

	private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target;
		const changedValue =
			target.type === "checkbox" ? target.checked : target.value;
		const changedEntry = target.name;
		this.setState({ [changedEntry]: changedValue });
	};

	private onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		console.log(event);
		console.log(this.state);

		this.checkName();
		this.checkMail();
		this.checkMessage();
		this.checkDSGVO();
		this.checkHuman();

		const areAllEntriedValid =
			this.state.isValidMail &&
			this.state.isValidName &&
			this.state.isValidAcceptsDSGVO &&
			this.state.isValidIsHuman &&
			this.state.isValidMessage;

		// const areAllEntriedValid =
		// this.entryValidation("name", "text").valid &&
		// this.entryValidation("mail", "text").valid &&
		// this.entryValidation("text", "textarea").valid &&
		// this.entryValidation("acceptsDSGVO", "checkbox").valid &&
		// this.entryValidation("isHuman", "checkbox").valid;

		if (areAllEntriedValid) {
			console.log("ALL VALID");
			const sendMailResult = await this.sendMail(
				"[HP] Nachricht von " + this.state.name,
				this.state.mail,
				this.state.message
			);
			if (sendMailResult) {
				// this.setState({ submitWasHit: true });
			}
		} else {
			console.log("NOPE");
		}
	};

	private sendMail(
		heading: string,
		returnMail: string,
		message: string
	): Promise<boolean> {
		const resultPromise = new Promise<boolean>((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("POST", "./mail_api_send.php", true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						console.log("success");
					} else {
						console.log("fail");
					}
					console.log(xhr);
				}
			};
			const publishingJson = {
				mail_heading: heading,
				mail_content: message,
				mail_from: returnMail,
				DBG_CONTACT_TILE: DBG_CONTACT_TILE
			};
			xhr.send(JSON.stringify(publishingJson));
		});
		return resultPromise;
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
										value={this.state.name}
										onChange={this.handleChange}
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
										value={this.state.mail}
										onChange={this.handleChange}
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
											this.state.message.length}
									</ValidationSpan>
								</ContactFormLabel>
								<ContactFormInputDiv>
									<ContactFormInputTextarea
										type="textarea"
										name="message"
										maxLength="1000"
										value={this.state.message}
										onChange={this.handleChange}
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
										onClick={() =>
											this.props.contentSwitcher(
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
										checked={this.state.acceptsDSGVO}
										onChange={this.handleChange}
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
										checked={this.state.isHuman}
										onChange={this.handleChange}
									/>
								</ContactFormInputDiv>
							</ContactFormUnit>
							<ContactFormUnit>
								<ContactFormInputSubmit
									type="submit"
									value="Submit"
								/>
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
	mail?: string;
	name?: string;
	acceptsDSGVO?: boolean;
	isHuman?: boolean;
	message?: string;
	isValidMail?: boolean;
	isValidName?: boolean;
	isValidAcceptsDSGVO?: boolean;
	isValidIsHuman?: boolean;
	isValidMessage?: boolean;
}
