# Changelog

All notable changes to the [camunda-modeler-token-simulation-plugin](https://github.com/camunda/camunda-modeler-token-simulation-plugin/blob/master/CHANGELOG.md) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 0.21.0

* `FEAT`: support Camunda Modeler `v5.29.0`
* `DEPS`: bump to `bpmn-js-token-simulation@0.36.0`

## 0.20.0

* `FEAT`: support implicit start events ([bpmn-io/bpmn-js-token-simulation#144](https://github.com/bpmn-io/bpmn-js-token-simulation/issues/144))
* `DEPS`: bump to `bpmn-js-token-simulation@0.33.0`

## 0.19.0

* `FEAT`: support inclusive gateways ([bpmn-io/bpmn-js-token-simulation#110](https://github.com/bpmn-io/bpmn-js-token-simulation/pull/110), [bpmn-io/bpmn-js-token-simulation#88](https://github.com/bpmn-io/bpmn-js-token-simulation/issues/88))
* `DEPS`: bump to `bpmn-js-token-simulation@0.32.0`

## 0.18.0

* `DEPS`: bump to `bpmn-js-token-simulation@0.31.1`

## 0.17.0

* `FEAT`: reworked the simulation log ([bpmn-io/bpmn-js-token-simulation#123](https://github.com/bpmn-io/bpmn-js-token-simulation/pull/123))
* `FIX`: don't activate token simulation when pressing `R` ([#60](https://github.com/camunda/camunda-modeler-token-simulation-plugin/issues/60))
* `CHORE`: rename project to `camunda-modeler-token-simulation-plugin` ([#47](https://github.com/camunda/camunda-modeler-token-simulation-plugin/issues/47))
* `DEPS`: bump to `bpmn-js-token-simulation@0.30.1`

## 0.15.0

* `DEPS`: bump to `bpmn-js-token-simulation@0.24.0`
* `DEPS`: bump to `bpmn-js@8.9.0`
* `DEPS`: bump to `camunda-modeler-plugin-helpers@3.1.0`

## 0.14.0

* `FEAT`: execute message flows in interaction direction
* `FEAT`: support bi-directional message flows ([#42](https://github.com/bpmn-io/bpmn-js-token-simulation-plugin/issues/42))
* `FIX`: do not signal participant on un-directed message receive
* `DEPS`: bump to `bpmn-js-token-simulation@0.22.0`

## 0.13.1

* `FIX`: correct join after parallel gateway with destroyed scopes
* `DEPS`: bump to `bpmn-js-token-simulation@0.21.2`

## 0.13.0

_Uses [`bpmn-js-token-simulation@0.12+`](https://github.com/bpmn-io/bpmn-js-token-simulation/blob/master/CHANGELOG.md#0120) under the hood which is a major rework of the original token simulation tool._

* `FEAT`: support signals
* `FEAT`: support message flows
* `FEAT`: support escalation
* `FEAT`: support BPMN 2.0 spec like event sub-processes
* `FEAT`: support multiple concurrent process instances
* `FEAT`: support link events
* `FEAT`: color tokens to distinguish process instances
* `FEAT`: add ability to filter view on a single running process instance
* `FEAT`: allow triggering of boundary events on tasks
* `FIX`: correct pause and play activation ([#30](https://github.com/bpmn-io/bpmn-js-token-simulation-plugin/issues/30), [#29](https://github.com/bpmn-io/bpmn-js-token-simulation-plugin/issues/29))
* `DEPS`: bump to `bpmn-js-token-simulation@0.19.3`

## 0.12.0

* `FEAT`: allow switch to XML tab / diagram save when simulation is active
* `FIX`: make compatible with Camunda Modeler v4.6+

## 0.11.0

* `DEPS`: bump to `bpmn-js-token-simulation@0.11.0`

## 0.10.1

* `FIX`: update token simulation styles ([#18](https://github.com/bpmn-io/bpmn-js-token-simulation-plugin/issues/18))

## 0.10.0

* `CHORE`: update to [`bpmn-js-token-simulation@0.10`](https://github.com/bpmn-io/bpmn-js-token-simulation/blob/master/CHANGELOG.md#0100)

## 0.9.0

* `CHORE`: support Camunda Modeler v3.x.x

## 0.8.0

* `CHORE`: support Camunda Modeler v2.1.0 ([#13](https://github.com/bpmn-io/bpmn-js-token-simulation-plugin/pull/13))
* `CHORE`: update to [`bpmn-js-token-simulation@0.8`](https://github.com/bpmn-io/bpmn-js-token-simulation/blob/master/CHANGELOG.md#080)

## ...

Check `git log` for earlier history.
