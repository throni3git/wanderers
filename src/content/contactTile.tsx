import * as React from "react";

import styled from "styled-components";

import { ScrollComponent } from "./tileComponents";
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
 * Validates whether a field is a valid email
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @returns {string} - The error message
 */
export const isEmail = (values: IContactTileState, fieldName: string): string =>
	values[fieldName] &&
	values[fieldName].search(
		/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
	)
		? "This must be in a valid email format"
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

export class ContactTile extends React.Component<
	IContactTileProps,
	IContactTileState
> {
	constructor(props: ContactTile["props"]) {
		super(props);
		this.state = {
			name: "",
			mail: "",
			text: "",
			acceptsDSGVO: false,
			isHuman: false
		};

		if (DBG_CONTACT_TILE) {
			this.state = {
				...this.state,
				name: "Test",
				mail: "throni3@gmx.de",
				text: "Wir testen und wir testen",
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

	private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target;
		const changedValue =
			target.type === "checkbox" ? target.checked : target.value;
		const changedEntry = target.name;
		this.setState({ [changedEntry]: changedValue });
	};

	private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		console.log(event);
		console.log(this.state);

		const areAllEntriedValid =
			this.entryValidation("name", "text").valid &&
			this.entryValidation("mail", "text").valid &&
			this.entryValidation("text", "textarea").valid &&
			this.entryValidation("acceptsDSGVO", "checkbox").valid &&
			this.entryValidation("isHuman", "checkbox").valid;

		if (areAllEntriedValid) {
			console.log("ALL VALID");
			this.sendMail(
				"[HP] Nachricht von " + this.state.name,
				this.state.mail,
				this.state.text,
				this.state.name
			);
		} else {
			console.log("NOPE");
		}
	};

	private sendMail(
		heading: string,
		returnMail: string,
		message: string,
		senderName: string
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
								<ContactFormLabel>
									Name{" "}
									<ValidationSpan>
										{
											this.entryValidation("name", "text")
												.message
										}
									</ValidationSpan>
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
								<ContactFormLabel>
									Mail{" "}
									<ValidationSpan>
										{
											this.entryValidation("mail", "text")
												.message
										}
									</ValidationSpan>
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
								<ContactFormLabel>
									Text{" "}
									<ValidationSpan>
										{
											this.entryValidation(
												"text",
												"textarea"
											).message
										}
									</ValidationSpan>
								</ContactFormLabel>
								<ContactFormInputDiv>
									<ContactFormInputTextarea
										type="textarea"
										name="text"
										maxLength="1000"
										value={this.state.text}
										onChange={this.handleChange}
									/>
								</ContactFormInputDiv>
							</ContactFormUnit>
							<ContactFormUnit>
								<ContactFormLabel>
									Accept DSGVO{" "}
									<ValidationSpan>
										{
											this.entryValidation(
												"acceptsDSGVO",
												"checkbox"
											).message
										}
									</ValidationSpan>
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
								<ContactFormLabel>
									I am a human from the earth{" "}
									<ValidationSpan>
										{
											this.entryValidation(
												"isHuman",
												"checkbox"
											).message
										}
									</ValidationSpan>
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

export interface IContactTileProps {}

interface IContactTileState {
	mail?: string;
	name?: string;
	acceptsDSGVO?: boolean;
	isHuman?: boolean;
	text?: string;
}
