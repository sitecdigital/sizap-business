import React, { useState, useCallback, useContext, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import TicketsManager from "../../components/TicketsManagerTabs";
import Ticket from "../../components/Ticket";

import { QueueSelectedProvider } from "../../context/QueuesSelected/QueuesSelectedContext";
import { TicketsContext } from "../../context/Tickets/TicketsContext";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import api from "../../services/api";
import { CircularProgress } from "@material-ui/core";
import { getBackendUrl } from "../../config";
import logo from "../../assets/logo.png";
import logoDark from "../../assets/logo-black.png";

const defaultTicketsManagerWidth = 550;
const minTicketsManagerWidth = 404;
const maxTicketsManagerWidth = 700;

const useStyles = makeStyles((theme) => ({
	chatContainer: {
		flex: 1,
		// padding: "15px 36px",
		height: `calc(100% - 78px)`,
		overflowY: "hidden",
	},
	chatPapper: {
		display: "flex",
		height: "100%",
		// borderRadius: `14px`,
		overflow: `hidden`,
		boxShadow: `rgba(0, 0, 0, 0.16) 0px 1px 4px;`
	},
	contactsWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		overflowY: "hidden",
		position: "relative",
	},
	messagesWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		flexGrow: 1,
	},
	welcomeMsg: {
		background: theme.palette.tabHeaderBackground,
		display: "flex",
		justifyContent: "space-evenly",
		alignItems: "center",
		height: "100%",
		textAlign: "center",
		// borderRadius: `0 14px 14px 0`
	},
	logo: {
		logo: theme.logo,
		content: "url(" + (theme.mode === "light" ? "./logo_light.svg" : theme.calculatedLogoDark()) + ")"
	},
}));

const TicketsCustom = () => {
	const { user } = useContext(AuthContext);

	const classes = useStyles({ ticketsManagerWidth: user.defaultTicketsManagerWidth || defaultTicketsManagerWidth });

	const { ticketId } = useParams();

	const [ticketsManagerWidth, setTicketsManagerWidth] = useState(0);
	const ticketsManagerWidthRef = useRef(ticketsManagerWidth);

	useEffect(() => {
		if (user && user.defaultTicketsManagerWidth) {
			setTicketsManagerWidth(user.defaultTicketsManagerWidth);
		}
	}, [user]);

	// useEffect(() => {
	// 	if (ticketId && currentTicket.uuid === undefined) {
	// 		history.push("/tickets");
	// 	}
	// }, [ticketId, currentTicket.uuid, history]);

	const handleMouseDown = (e) => {
		document.addEventListener("mouseup", handleMouseUp, true);
		document.addEventListener("mousemove", handleMouseMove, true);
	};
	const handleSaveContact = async value => {
		if (value < 404)
			value = 404
		await api.put(`/users/toggleChangeWidht/${user.id}`, { defaultTicketsManagerWidth: value });

	}
	const handleMouseMove = useCallback(
		(e) => {
			const newWidth = e.clientX - document.body.offsetLeft;
			if (
				newWidth > minTicketsManagerWidth &&
				newWidth < maxTicketsManagerWidth
			) {
				ticketsManagerWidthRef.current = newWidth;
				setTicketsManagerWidth(newWidth);
			}
		},
		[]
	);

	const handleMouseUp = async () => {
		document.removeEventListener("mouseup", handleMouseUp, true);
		document.removeEventListener("mousemove", handleMouseMove, true);

		const newWidth = ticketsManagerWidthRef.current;

		if (newWidth !== ticketsManagerWidth) {
			await handleSaveContact(newWidth);
		}
	};

	return (
		<QueueSelectedProvider>
			<div className={classes.chatContainer}>
				<div className={classes.chatPapper}>
					<div
						className={classes.contactsWrapper}
						style={{ width: ticketsManagerWidth }}
					>
						<TicketsManager />
						<div onMouseDown={e => handleMouseDown(e)} className={classes.dragger} />
					</div>
					<div className={classes.messagesWrapper}>
						{ticketId ? (
							<>
								{/* <Suspense fallback={<CircularProgress />}> */}
								<Ticket />
								{/* </Suspense> */}
							</>
						) : (
							<Hidden only={["sm", "xs"]}>
								<Paper square className={classes.welcomeMsg}>
									<span>
										<center>
											<img className={classes.logo} width="50%" alt="" />
										</center>
										{i18n.t("chat.noTicketMessage")}
									</span>								</Paper>
							</Hidden>
						)}
					</div>
				</div>
			</div>
		</QueueSelectedProvider>
	);
};

export default TicketsCustom;