// import style from "./style.module.css";
import "./styles.css";

import { Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function CartTitle({ len, closeHandle }) {
    return (
        <div className="cartTitle">
            <div className="titleText">
                <Title level={3}>Cart</Title>
                <Text>{`(${len})`}</Text>
            </div>
            <CloseOutlined onClick={closeHandle} />
        </div>
    );
}
