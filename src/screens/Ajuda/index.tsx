import React, { useState } from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";

import { useTranslation } from "react-i18next";
import Accordion from "react-native-collapsible/Accordion";

import {
  Container,
  DescriptionText,
  HeaderText,
  HeaderDescriptionContainer,
  HeaderTextContainer,
  StyledFeatherIcon,
} from "./styles";

type HelperTextsProps = {
  identificator: string;
  title: string;
  content: string;
};

const Ajuda = () => {
  const { t } = useTranslation();

  // Ddefault active selector
  const [activeSections, setActiveSections] = useState<string[] | number[]>([]);

  const HELP_TEXTS = [
    {
      identificator: "backupandrestore",
      title: t("screens.ajuda.backupandrestore_title"),
      content: t("screens.ajuda.backupandrestore_content"),
    },
    {
      identificator: "biblestudies",
      title: t("screens.ajuda.biblestudies_title"),
      content: t("screens.ajuda.biblestudies_content"),
    },
    {
      identificator: "chronometer",
      title: t("screens.ajuda.chronometer_title"),
      content: t("screens.ajuda.chronometer_content"),
    },
    {
      identificator: "reports",
      title: t("screens.ajuda.reports_title"),
      content: t("screens.ajuda.reports_content"),
    },
    {
      identificator: "persons",
      title: t("screens.ajuda.persons_title"),
      content: t("screens.ajuda.persons_content"),
    },
    {
      identificator: "territories",
      title: t("screens.ajuda.territories_title"),
      content: t("screens.ajuda.territories_content"),
    },
    {
      identificator: "privaciandpolicy",
      title: t("screens.ajuda.privaciandpolicy_title"),
      content: t("screens.ajuda.privaciandpolicy_content"),
    },
    {
      identificator: "about",
      title: t("screens.ajuda.about_title"),
      content: t("screens.ajuda.about_content"),
    },
    {
      identificator: "contribute",
      title: t("screens.ajuda.contribute_title"),
      content: t("screens.ajuda.contribute_content"),
    },
  ];

  //setting up a active section state
  const setSections = (sections: string[] | number[]) => {
    setActiveSections(sections.includes(undefined as never) ? [] : sections);
  };

  //Accordion Header view
  const renderHeader = (section: any, index: any, isActive: any) => {
    return (
      <HeaderTextContainer
        // durationProp={400}
        isActiveProp={isActive}
        transition="backgroundColor"
      >
        <>
          <HeaderText>{`${index + 1} • ${section.title}`}</HeaderText>

          {section.identificator === `biblestudies` && (
            <TouchableWithoutFeedback
              onPress={() => {
                Linking.openURL("https://youtu.be/2Ff0X9awsjM");
              }}
            >
              <StyledFeatherIcon name="youtube" size={22} />
            </TouchableWithoutFeedback>
          )}

          {section.identificator === "privaciandpolicy" && (
            <TouchableWithoutFeedback
              onPress={() => {
                Linking.openURL(
                  "https://pedropaulodev.notion.site/Pol-tica-de-Privacidade-e-LGPD-dc8a17a00aa14566a9238f5024674d9a"
                );
              }}
            >
              <StyledFeatherIcon name="external-link" size={22} />
            </TouchableWithoutFeedback>
          )}

          {section.identificator === "contribute" && (
            <TouchableWithoutFeedback
              onPress={() => {
                Linking.openURL(
                  "https://github.com/TJ-Droid/tjdroid#world_map-contribution-with-translations"
                );
              }}
            >
              <StyledFeatherIcon name="external-link" size={22} />
            </TouchableWithoutFeedback>
          )}
        </>
      </HeaderTextContainer>
    );
  };

  //Accordion Content view
  const renderContent = (section: any, index: any, isActive: any) => {
    return (
      <HeaderDescriptionContainer
        duration={400}
        isActiveProp={isActive}
        transition="backgroundColor"
      >
        <DescriptionText
        // animationProp={isActive}
        >
          {section.content}
        </DescriptionText>
      </HeaderDescriptionContainer>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <ScrollView>
          <Accordion
            activeSections={activeSections}
            //for any default active section
            sections={HELP_TEXTS}
            //title and content of accordion
            touchableComponent={TouchableHighlight}
            //which type of touchable component you want
            //It can be the following Touchables
            //TouchableHighlight, TouchableNativeFeedback
            //TouchableOpacity , TouchableWithoutFeedback
            expandMultiple={false}
            //Do you want to expand mutiple at a time or single at a time
            renderHeader={renderHeader}
            //Header Component(View) to render
            renderContent={renderContent}
            //Content Component(View) to render
            duration={400}
            //Duration for Collapse and expand
            onChange={setSections}
            //setting the state of active sections
          />
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
};

export default Ajuda;
