import React from 'react';
import ReactPDF, { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import Svg = ReactPDF.Svg;
import Line = ReactPDF.Line;

// Create styles
const styles = StyleSheet.create({
    container: {
        padding: 0,
        flexGrow: 1,
    },
    pageContainer: {
        paddingVertical: 19,
        paddingHorizontal: 19,
        paddingBottom: 40
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    logo: {
        width: '20%',
        height: 'auto',
        marginTop: 60
    },
    logoContainer: {
        display: 'flex',
        width: '60%',
        marginTop: 15
    },
    columnText: {
        display: 'flex'
    },
    boldTitleText: {
        // fontFamily: 'arialmtbold',
        fontWeight: 'bold',
        fontSize: 23.5,
        color:'rgb(51,51,51)'
    },
    boldSubtitleText: {
        // fontFamily: 'arialmtbold',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
        paddingTop: 8,
        color:'rgb(51,51,51)'
    },
    boldSubtitleText2: {
        // fontFamily: 'verdanabold',
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 5,
        paddingTop: 8,
        color:'rgb(51,51,51)'
    },
    titleTextWhite: {
        // fontFamily: 'Roboto',
        fontSize: 18,
        color: 'white'
    },
    boldTextWhite: {
        // fontFamily: 'arialmtbold',
        // fontWeight: 'demibold',
        fontSize: 11.5,
        color: 'white'
    },
    boldTextWhiteCurrency: {
        // fontFamily: 'arialmtbold',
        // fontWeight: 'demibold',
        fontSize: 15.5,
        color: 'white'
    },
    textLabel: {
        // fontFamily: 'arial',
        fontWeight: 'thin',
        fontSize: 9,
        color:'rgb(51,51,51)'
    },
    textNormal: {
        // fontFamily: 'arial',
        fontWeight: 'thin',
        fontSize: 10,
        color:'rgb(0,0,0)'
    },
    textNormal2: {
        // fontFamily: 'arial',
        fontWeight: 'thin',
        fontSize: 11,
        color:'rgb(51,51,51)'
    },
    textSmall: {
        // fontFamily: 'arial',
        fontWeight: 'thin',
        fontSize: 9,
        color:'rgb(51,51,51)'

    },
    textSmall2: {
        // fontFamily: 'arial',
        fontWeight: 'thin',
        fontSize: 8,
        color:'rgb(112,112,112)'
    },
    textWhite: {
        // fontFamily: 'arialmtbold',
        fontSize: 9,
        color: 'white'
    },
    boldText: {
        // fontFamily: 'arialmtbold',
        fontWeight: 'demibold',
        fontSize: 12,
        color:'rgb(51,51,51)'
    },
    boldTextLarge: {
        // fontFamily: 'arialmtbold',
        fontWeight: 'demibold',
        fontSize: 16,
        color:'rgb(51,51,51)'
    },
    boldTextSmall: {
        // fontFamily: 'arialmtbold',
        fontWeight: 'demibold',
        fontSize: 9,
        color:'rgb(51,51,51)'
    },
    smallTextGray: {
        // fontFamily: 'arialmtbold',
        fontWeight: 'thin',
        color: 'rgb(102,102,102)',
        fontSize: 10
    },
    body: {
        display: 'flex',
        flexGrow: 1
    },
    detailsContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
    },
    invoicePartnerDetails: {
        display: 'flex',
        width: '45%'
    },
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
        padding: 20,
    },
    table: {
        display: "table" as any,
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeft: 0,
        borderColor: '#3D6B86',
        marginTop: 10
    },
    tableRow: {
        margin: 'auto',
        flexDirection: "row",
        width: 'auto'
    },
    tableCol: {
        width: "20%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeft: 0,
        borderRight: 0,
        borderTop: 0,
        borderColor: '#3D6B86',
    },
    tableCell: {
        // fontFamily:"arialmtbold",
        // margin: "auto",
        marginTop: 5,
        fontSize: 9,
        padding: 0,
        color:'rgb(51,51,51)'
    },
    tableCell2: {
        // fontFamily:"arialmtbold",
        marginBottom: 5,
        fontSize: 9,
        padding: 0,
        color:'rgb(51,51,51)'
    },
    rowCell: {
        // fontFamily:"arial",
        marginTop: 5,
        fontSize: 9,
        padding: 0,
        color:'rgb(51,51,51)'
    },
});

function formatCurrency(number: any) {
    if(!number){
        return 0;
    }
    const numberConverted = Number(number);
    if(!isNaN(numberConverted) ){
        return numberConverted.toLocaleString("en-en", {maximumFractionDigits: 2, minimumFractionDigits: 2})
            .replace(","," ");
    }else{
        return number;
    }
}

function formatDate(date:any){
    if(!date){
        return '-';
    }
    if(!(date instanceof Date)){
        date = new Date(date);
    }
    return ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
        date.getFullYear();
}

// Create Document Component
const ExportPdf = ({data, query}:{data: any, query: any}) => (
    <Document>
        <Page size="A4" style={styles.page}>

            <View style={styles.body}>
                <View style={styles.detailsContainer}>

                    <View style={{width: '54%', display: 'flex', paddingRight: 5}}>
                        <Text style={styles.smallTextGray}>Profit</Text>
                        <Svg height="5" width="125">
                            <Line
                                x1="0"
                                y1="2"
                                x2="200"
                                y2="2"
                                strokeWidth={0.5}
                                stroke="#4E7890"
                            />
                        </Svg>

                        <Text style={styles.textLabel}>
                            EUR: <Text style={styles.textNormal}>{formatCurrency(data.message.totals.find((item:any) => item.currency == 'EUR')?.profit)}</Text>
                        </Text>
                        <Text style={styles.textLabel}>
                            RON: <Text style={styles.textNormal}>{formatCurrency(data.message.totals.find((item:any) => item.currency == 'RON')?.profit)}</Text>
                        </Text>

                    </View>

                    <View style={{width: '45%', display: 'flex', paddingLeft: 5}}>
                        <Text style={styles.smallTextGray}>Pierderi</Text>
                        <Svg height="5" width="125">
                            <Line
                                x1="0"
                                y1="2"
                                x2="200"
                                y2="2"
                                strokeWidth={0.5}
                                stroke="#4E7890"
                            />
                        </Svg>
                        <Text style={styles.textLabel}>
                            EUR: <Text style={styles.textNormal}>{formatCurrency(data.message.totals.find((item:any) => item.currency == 'EUR')?.loss)}</Text>
                        </Text>
                        <Text style={styles.textLabel}>
                            RON: <Text style={styles.textNormal}>{formatCurrency(data.message.totals.find((item:any) => item.currency == 'RON')?.loss)}</Text>
                        </Text>

                    </View>

                    <View style={{width: '45%', display: 'flex', paddingLeft: 5}}>
                    <Text style={styles.smallTextGray}>Perioada</Text>
                    <Svg height="5" width="125">
                        <Line
                            x1="0"
                            y1="2"
                            x2="200"
                            y2="2"
                            strokeWidth={0.5}
                            stroke="#4E7890"
                        />
                    </Svg>
                    <Text style={styles.textLabel}>
                        Din: <Text style={styles.textNormal}>{formatDate(query?.date_from)}</Text>
                    </Text>
                    <Text style={styles.textLabel}>
                        Pana in:<Text style={styles.textNormal}> {formatDate(query?.date_to)}</Text>
                    </Text>

                </View>

                </View>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={{
                        width: "7%",
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderLeft: 0,
                        borderRight: 0,
                        borderTop: 0,
                        borderColor: '#3D6B86',
                        textAlign:"left"
                    }}><Text style={styles.tableCell}>Nr. crt</Text></View>
                    <View style={{
                        width: "20%",
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderLeft: 0,
                        borderRight: 0,
                        borderTop: 0,
                        borderColor: '#3D6B86',
                        textAlign:"left",
                        justifyContent:'center',
                        paddingLeft: 10,
                    }}><Text style={styles.tableCell}>Vehicul</Text></View>
                    <View style={{
                        width: "16%",
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderLeft: 0,
                        borderRight: 0,
                        borderTop: 0,
                        borderColor: '#3D6B86',
                        textAlign:"left",
                        justifyContent:'center'
                    }}><Text style={styles.tableCell}>Data</Text></View>
                    <View style={{
                        width: "24%",
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderLeft: 0,
                        borderRight: 0,
                        borderTop: 0,
                        borderColor: '#3D6B86',
                        textAlign:"left",
                        justifyContent:'center'

                    }}><Text style={styles.tableCell}>Descriere</Text></View>
                    <View style={{
                        width: "5%",
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderLeft: 0,
                        borderRight: 0,
                        borderTop: 0,
                        borderColor: '#3D6B86',
                        textAlign:"left"
                    }}>

                        <Text style={styles.tableCell}>Valuta </Text>
                        {/*<Text style={styles.tableCell2}>(fara TVA) TODO1</Text>*/}


                    </View>
                    <View style={{
                        width: "14%",
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderLeft: 0,
                        borderRight: 0,
                        borderTop: 0,
                        borderColor: '#3D6B86',
                        textAlign:"right"
                    }}><Text style={styles.tableCell}>Profit </Text>
                        {/*<Text style={styles.tableCell2}> TODO2</Text>*/}

                    </View>
                    <View style={{
                        width: "14%",
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderLeft: 0,
                        borderRight: 0,
                        borderTop: 0,
                        borderColor: '#3D6B86',
                        textAlign:"right"
                    }}><Text style={styles.tableCell}>Pierdere</Text>
                        {/*<Text style={styles.tableCell2}>-TODO3-</Text>*/}

                    </View>
                    {/*<View style={styles.tableCol}><Text style={styles.tableCell}>Pret unitar (fara TVA) -{invoiceData?.invoice?.currency}-</Text></View>*/}
                    {/*<View style={styles.tableCol}><Text style={styles.tableCell}>Valoarea TVA -{invoiceData?.invoice?.currency}-</Text></View>*/}
                </View>
                {data?.message.rows?.map((row: any, index: number) => {
                    return (
                        <View key={index} style={styles.tableRow}>
                            <View style={{
                                width: "7%",
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderLeft: 0,
                                borderRight: 0,
                                borderTop: 0,
                                borderColor: '#999999',
                                textAlign:"left",
                                justifyContent:'center',
                                paddingLeft: 5,
                            }}><Text style={styles.rowCell}>{index + 1}</Text></View>
                            <View style={{
                                width: "20%",
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderLeft: 0,
                                borderRight: 0,
                                borderTop: 0,
                                borderColor: '#999999',
                                textAlign:"left",
                                justifyContent:'center',
                                paddingLeft: 5,
                            }}><Text style={styles.rowCell}>{row.car}</Text></View>
                            <View style={{
                                width: "16%",
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderLeft: 0,
                                borderRight: 0,
                                borderTop: 0,
                                borderColor: '#999999',
                                textAlign:"left",
                                justifyContent:'center',
                                paddingLeft: 5,
                            }}><Text
                                style={styles.rowCell}>{formatDate(row.date)}</Text></View>
                            <View style={{
                                width: "24%",
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderLeft: 0,
                                borderRight: 0,
                                borderTop: 0,
                                borderColor: '#999999',
                                textAlign:"left",
                                justifyContent:'center',
                                paddingLeft: 5,
                            }}><Text style={styles.rowCell}>{row.description}</Text></View>
                            <View style={{
                                width: "5%",
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderLeft: 0,
                                borderRight: 0,
                                borderTop: 0,
                                borderColor: '#999999',
                                textAlign:"left",
                                justifyContent:'center',
                                paddingLeft: 5,
                            }}><Text style={styles.rowCell}>{row.currency}</Text></View>
                            <View style={{
                                width: "14%",
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderLeft: 0,
                                borderRight: 0,
                                borderTop: 0,
                                borderColor: '#999999',
                                textAlign:"right",
                                justifyContent:'center'
                            }}><Text style={styles.rowCell}>{formatCurrency(row.profit)}</Text></View>
                            <View style={{
                                width: "14%",
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderLeft: 0,
                                borderRight: 0,
                                borderTop: 0,
                                borderColor: '#999999',
                                textAlign:"right",
                                justifyContent:'center'
                            }}><Text style={styles.rowCell}>{
                                formatCurrency(row.loss)
                            }</Text></View>
                        </View>
                    );
                })}
            </View>
            </View>
        </Page>
</Document>
);

export default async (data: any, query:any) => {
    return await ReactPDF.renderToStream(<ExportPdf data={data} query={query}/>);
};