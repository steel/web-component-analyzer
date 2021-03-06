import * as tsModule from "typescript";
import { Node, TypeChecker } from "typescript";
import { AnalyzeComponentsConfig } from "../analyze-components";
import { ComponentCSSPart } from "../types/component-css-part";
import { ComponentCSSProperty } from "../types/component-css-property";
import { ComponentDiagnostic } from "../types/component-diagnostic";
import { ComponentMember } from "../types/component-member";
import { ComponentSlot } from "../types/component-slot";
import { EventDeclaration } from "../types/event-types";

export interface FlavorVisitContext {
	checker: TypeChecker;
	ts: typeof tsModule;
	config: AnalyzeComponentsConfig;
	emitContinue?(): void;
	emitDiagnostics(diagnostic: ComponentDiagnostic): void;
	features?: FlavorVisitContextFeatures;
}

export interface FlavorVisitContextFeatures {
	getMembers(): ComponentMember[];
	getSlots(): ComponentSlot[];
	getCSSProps(): ComponentCSSProperty[];
	getCSSParts(): ComponentCSSPart[];
	getEvents(): EventDeclaration[];
	getInheritNodes(): Node[];
	getInherits(): string[];
}

export interface DefinitionNodeResult {
	tagName: string;
	identifierNode: Node;
	definitionNode: Node;
	declarationNode: Node;
	declarationHandler?: ParseComponentFlavor["parseDeclarationMembers"];
}

export interface VisitComponentDefinitionContext extends FlavorVisitContext {
	emitDefinitionResult(result: DefinitionNodeResult): void;
}

export interface ParseComponentMembersContext extends FlavorVisitContext {
	declarationNode: Node;
}

export interface ParseVisitContextGlobalEvents extends FlavorVisitContext {
	emitEvent(event: EventDeclaration): void;
}

export interface ParseComponentFlavor {
	visitComponentDefinitions?(node: Node, context: VisitComponentDefinitionContext): void;
	parseDeclarationMembers?(node: Node, context: ParseComponentMembersContext): ComponentMember[] | undefined;
	parseDeclarationEvents?(node: Node, context: ParseComponentMembersContext): EventDeclaration[] | undefined;
	parseDeclarationSlots?(node: Node, context: ParseComponentMembersContext): ComponentSlot[] | undefined;
	parseDeclarationCSSProps?(node: Node, context: ParseComponentMembersContext): ComponentCSSProperty[] | undefined;
	parseDeclarationCSSParts?(node: Node, context: ParseComponentMembersContext): ComponentCSSPart[] | undefined;

	visitGlobalEvents?(node: Node, context: ParseVisitContextGlobalEvents): void;
}
