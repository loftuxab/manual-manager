#!/bin/bash
# Downloads the spring-loaded lib if not existing and runs the full all-in-one
# (Alfresco + Share + Solr) using the runner project
#springloadedfile=~/.m2/repository/org/springframework/springloaded/1.2.5.RELEASE/springloaded-1.2.5.RELEASE.jar
springloadedfile=/Users/peter/Code/springloaded-1.2.6.BUILD-20160119.073648-7.jar
if [ ! -f $springloadedfile ]; then
mvn validate -Psetup
fi

# Use these settings if you're using JDK7
# MAVEN_OPTS="-javaagent:$springloadedfile -noverify -Xms256m -Xmx2G -XX:PermSize=300m" mvn install -Prun

# Spring loaded does not work very well with 5.1 at the moment, breaks the H2 db after first run and then restart
MAVEN_OPTS="-Xms256m -Xmx2G" mvn clean install -Prun,\!enforce-sdk-rules
#MAVEN_OPTS="-noverify -Xms256m -Xmx2G" mvn clean install -Prun