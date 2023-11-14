import { IDeviz } from "../../../common/interfaces/deviz.interface";

const devizObjectForFrontend = async (deviz: IDeviz) => {
    if (deviz.AutoFleet) {
        deviz.dataValues.name = deviz.AutoFleet.reg_no;
        delete deviz.dataValues.AutoFleet;
        delete deviz.dataValues.Partner;
    } else if (deviz.Partner) {
        deviz.dataValues.name = deviz.Partner.name;
        delete deviz.dataValues.Partner;
        delete deviz.dataValues.AutoFleet;
    }

    return deviz;
}

export default devizObjectForFrontend;