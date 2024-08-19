import { Button } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { changeModals } from "../components/modals/modals";

const PageHome = () => {
	const addHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
		window.dispatchEvent(changeModals({
			ModalOrderForm: { open: true }
		}));
	}

  return (
    <PageHomeStyle id="Home">
      <div className="buttons">
				<Button variant="contained" onClick={addHandler}>Add</Button>
			</div>
    </PageHomeStyle>
  );
};

export { PageHome };

const PageHomeStyle = styled.div`
	flex-shrink: 0;
	flex-grow: 1;

	.buttons {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;
