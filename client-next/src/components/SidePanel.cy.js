import { mount } from "cypress-react-unit-test";
import React from "react";
import SidePanel from "./SidePanel";

describe("SidePanel", () => {

  it("SidePanel", () => {
    const trees = [{
      first_name: "Dadior",
      last_name: "Chen",
      image_url: "https://treetracker-production.nyc3.digitaloceanspaces.com/2018.11.20.12.11.07_e7a81cf4-2d37-45ee-9d5a-47bdfd7c43cc_IMG_20181120_121037_7990135604649410080.jpg",
      user_image_url: "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.10.18.32.42_b4fad89a-10b6-40cc-a134-0085d0e581d2_IMG_20190710_183201_8089920786231467340.jpg",
      id: 1,
    },{
      first_name: "Ezra",
      last_name: "David",
      image_url: "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.09.07.11.04.27_3ae160d9-58f7-4373-a4c2-3b39edbacd2e_IMG_20180907_095704_764193446.jpg",
      user_image_url: "https://treetracker-production.nyc3.digitaloceanspaces.com/Miti%20Aliance%20Image2.png",
      id: 2,
    }];

    function Test(){
      const [treeIndex, setTreeIndex] = React.useState(0);

      function handleNext(){
        setTreeIndex(treeIndex + 1);
      }

      return(
        <div style={{background:"gray",height:"1000px"}} >
          <SidePanel 
            state={"show"}
            tree={trees[treeIndex]} 
            onNext={handleNext}
            hasNext={treeIndex < trees.length - 1}
            hasPrev={treeIndex > 0}
          />
        </div>
      )
    }
    mount(
      <Test/>
    );
    cy.contains("Dadior");
    //is loading
    //cy.get(".treePictureLoading");
    cy.get(".treePictureLoaded", {timeout: 1000* 30});
    cy.get("button[title='previous tree']").should("not.exist");
    cy.get("button[title='next tree']")
      .click();
    cy.contains("Ezra");
    cy.get("button[title='previous tree']");
    cy.get("button[title='next tree']").should("not.exist");
    cy.get(".treePictureLoaded", {timeout:1000*30});
//    //should placed logo as avatar, cuz no image
//    cy.get("#planter-img")
//      .find("img")
//      .should("has.attr", "src")
//      .and("match", /greenstand_logo/);
  });

  it("SidePanelEmpty", () => {

    function Test(){
      const [state, setState] = React.useState("none");
      const [tree, setTree] = React.useState(undefined);
      function handleClick(){
        setTree({
          first_name: "Dadior",
          last_name: "Chen",
        });
        setState("show");
      }
      function handleClose(){
        setState("hide");
      }

      function handleShow(){
        setState("show");
      }

      function handleDisable(){
        setState("none");
      }
      return(
        <div>
          <button onClick={handleClick}>show</button>
          <button onClick={handleDisable}>disable</button>
          <SidePanel state={state} tree={tree} onClose={handleClose} onShow={handleShow} />
        </div>
      )
    }
    mount(
      <Test/>
    );
    cy.contains("show").click();
    cy.contains("Dadior");
    cy.get(".treePictureLoading").should("not.exist");
    cy.get("img[alt='tree planted']").should("not.exist");

    //close it
    cy.get("div[title='hide']")
      .click();
    cy.contains("Dadior")
      .should("not.visible");
    cy.get("div[title='show']")
      .click();
    cy.contains("Dadior")
      .should("visible");
    cy.contains("disable")
      .click();
    cy.get("div[title='show']")
      .should("not.exist");
  });

  it("wallet", () => {
    mount(
    <SidePanel 
      state={"show"} 
      tree={{
          attachedWallet: "Zaven",
          id: 1,
          first_name: "FFF",
          last_name: "RRR",
          token_uuid: "TESTTESTTEST",
        }}
    />
    );
    cy.contains("@Zaven");
    cy.contains("Token issued");
    cy.contains("TESTTEST");

  });
  


  describe.only("Image cases", () => {
    [
      "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2019.11.08.11.12.43_1a507e4a-ade7-47d7-b7f5-e1a425588483_IMG_20191030_173914_4000805348046989577.jpg",
      "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.26.09.45.44_96a38beb-b5ac-4262-82d1-9135420474c9_IMG_20190620_120738_1011429861.jpg",
      "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.01.17.10.31.51_1705f1ab-1994-43a8-9534-a76a9e2b48db_IMG_20200117_102352_8862780428939765465.jpg",
      "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2019.12.04.18.58.38_2834d4b8-30f0-406a-af0c-82064cb1f84a_IMG_20191204_112420_2460689874172711670.jpg",
      "https://treetracker-dev.nyc3.digitaloceanspaces.com/2018.09.10.16.33.09_ec3c3595-f201-4810-95fe-b579776a59ee_IMG_20180910_134410_7543746528105600776.jpg",
      "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2019.10.19.17.38.39_c3540511-f5be-41f7-8181-19d0e4fadf15_IMG_20191019_111625_6038961263453035792.jpg",
      "https://treetracker-dev.nyc3.digitaloceanspaces.com/4268.jpg",
      "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.03.09.43.26_2171ce9b-12db-49af-b434-084b8a92ec20_IMG_20190703_091728_7632360557292915035.jpg",
      "https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2020.06.26.18.38.39_ba1cab33-9880-4be6-b091-18894e5a9ac6_IMG_20200626_182354_-2006074918.jpg",
      "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.24.10.18.09_d7af94fb-ff64-43cb-b2e7-bd38e383eb1d_IMG_20190724_100849_4516267486741498296.jpg",
    ].forEach((url, i) => {
      it(`image case ${i}`, () => {
        mount(
          <SidePanel 
          state={"show"} 
          tree={{
            id: 1,
              first_name: "FFF",
              last_name: "RRR",
              image_url: url,
          }}
          />
        );
        cy.contains("FFF");
      });
    });

  });

  describe.only("Avatar cases", () => {
    [
      "https://treetracker-production.nyc3.digitaloceanspaces.com/User1111.jpg",
      "https://treetracker-production.nyc3.digitaloceanspaces.com/user_1047.jpg",
      "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.24.13.42.55_0d0c2bc4-a6a1-4521-ae05-6c7c45588443_IMG_20190724_134109_6975244402804446311.jpg",
    ].forEach((url, i) => {
      it(`avatar case ${i}`, () => {
        mount(
          <SidePanel 
          state={"show"} 
          tree={{
            id: 1,
              first_name: "FFF",
              last_name: "RRR",
              user_image_url: url,
          }}
          />
        );
        cy.contains("FFF");
      });
    });

  });

});

